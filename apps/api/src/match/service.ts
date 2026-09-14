import { createHash, randomBytes, randomInt, randomUUID } from 'node:crypto';
import { and, asc, eq, lt, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  matchParticipant,
  matchRoom,
  matchVote,
  tasteProfile,
  type DeckCard,
  type RoomMediaType,
  type RoomStatus,
} from '../db/schema.js';
import { buildDeckBatch } from './deck.js';

export const MAX_PARTICIPANTS = 8;
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I lookalikes
const CODE_LENGTH = 6;

type Room = typeof matchRoom.$inferSelect;
type Participant = typeof matchParticipant.$inferSelect;

export class MatchError extends Error {
  constructor(
    readonly code:
      | 'room_not_found'
      | 'room_full'
      | 'room_closed'
      | 'not_host'
      | 'invalid_state'
      | 'not_voter'
      | 'invalid_card'
      | 'no_cards',
  ) {
    super(code);
  }
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const majorityOf = (voters: number) => Math.floor(voters / 2) + 1;

function newCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

async function getRoomOrThrow(code: string): Promise<Room> {
  const [room] = await db.select().from(matchRoom).where(eq(matchRoom.code, code));
  if (!room || room.expiresAt < new Date()) throw new MatchError('room_not_found');
  return room;
}

async function addParticipant(
  roomCode: string,
  input: { nickname: string; userId: string | null; isHost: boolean },
): Promise<{ participant: Participant; token: string }> {
  const token = randomBytes(32).toString('base64url');

  // Signed-in users keep their seat (and votes) if they rejoin from another device.
  if (input.userId) {
    const [existing] = await db
      .select()
      .from(matchParticipant)
      .where(and(eq(matchParticipant.roomCode, roomCode), eq(matchParticipant.userId, input.userId)));
    if (existing) {
      const [participant] = await db
        .update(matchParticipant)
        .set({ tokenHash: hashToken(token) })
        .where(eq(matchParticipant.id, existing.id))
        .returning();
      return { participant, token };
    }
  }

  // Pre-fill genres from the taste profile so signed-in users can skip that step.
  const [taste] = input.userId
    ? await db.select().from(tasteProfile).where(eq(tasteProfile.userId, input.userId))
    : [];

  const [participant] = await db
    .insert(matchParticipant)
    .values({
      id: randomUUID(),
      roomCode,
      userId: input.userId,
      nickname: input.nickname,
      tokenHash: hashToken(token),
      isHost: input.isHost,
      genres: taste?.likedGenres ?? [],
    })
    .returning();
  return { participant, token };
}

export async function createRoom(input: {
  mediaType: RoomMediaType;
  lang: string;
  nickname: string;
  userId: string | null;
}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    const [room] = await db
      .insert(matchRoom)
      .values({ code, mediaType: input.mediaType, lang: input.lang, expiresAt: new Date(Date.now() + ROOM_TTL_MS) })
      .onConflictDoNothing()
      .returning();
    if (!room) continue;
    const { participant, token } = await addParticipant(code, { ...input, isHost: true });
    return { room, participant, token };
  }
  throw new Error('Could not allocate a room code');
}

export async function roomPreview(code: string) {
  const room = await getRoomOrThrow(code);
  const participants = await db
    .select({ nickname: matchParticipant.nickname, isHost: matchParticipant.isHost })
    .from(matchParticipant)
    .where(eq(matchParticipant.roomCode, code));
  return {
    code: room.code,
    status: room.status,
    mediaType: room.mediaType,
    participants: participants.length,
    host: participants.find((participant) => participant.isHost)?.nickname ?? null,
    joinable: participants.length < MAX_PARTICIPANTS && (room.status === 'lobby' || room.status === 'genres'),
  };
}

export async function joinRoom(code: string, input: { nickname: string; userId: string | null }) {
  const room = await getRoomOrThrow(code);
  const participants = await db.select().from(matchParticipant).where(eq(matchParticipant.roomCode, code));
  const returning = input.userId && participants.some((participant) => participant.userId === input.userId);

  if (!returning) {
    if (room.status !== 'lobby' && room.status !== 'genres') throw new MatchError('room_closed');
    if (participants.length >= MAX_PARTICIPANTS) throw new MatchError('room_full');
  }
  return addParticipant(code, { ...input, isHost: false });
}

export async function authenticate(code: string, token: string): Promise<Participant | null> {
  const [participant] = await db
    .select()
    .from(matchParticipant)
    .where(and(eq(matchParticipant.roomCode, code), eq(matchParticipant.tokenHash, hashToken(token))));
  return participant ?? null;
}

export async function getParticipant(id: string): Promise<Participant | null> {
  const [participant] = await db.select().from(matchParticipant).where(eq(matchParticipant.id, id));
  return participant ?? null;
}

function requireHost(participant: Participant) {
  if (!participant.isHost) throw new MatchError('not_host');
}

/* Lobby → genres ------------------------------------------------------ */

export async function startGenres(participant: Participant) {
  requireHost(participant);
  const [room] = await db
    .update(matchRoom)
    .set({ status: 'genres' })
    .where(and(eq(matchRoom.code, participant.roomCode), eq(matchRoom.status, 'lobby')))
    .returning();
  if (!room) throw new MatchError('invalid_state');
}

export async function submitGenres(participant: Participant, genres: number[]) {
  const room = await getRoomOrThrow(participant.roomCode);
  if (room.status !== 'lobby' && room.status !== 'genres') throw new MatchError('invalid_state');

  await db
    .update(matchParticipant)
    .set({ genres: [...new Set(genres)], ready: true })
    .where(eq(matchParticipant.id, participant.id));

  // Everyone is ready: no need to wait for the host.
  if (room.status === 'genres') {
    const participants = await db.select().from(matchParticipant).where(eq(matchParticipant.roomCode, room.code));
    if (participants.every((item) => item.ready)) await beginSwiping(room.code);
  }
}

/* Genres → swiping ---------------------------------------------------- */

export async function startSwiping(participant: Participant) {
  requireHost(participant);
  const room = await getRoomOrThrow(participant.roomCode);
  if (room.status !== 'genres') throw new MatchError('invalid_state');
  await beginSwiping(room.code);
}

async function beginSwiping(code: string) {
  // Claim the transition first so concurrent "ready" messages don't build two decks.
  const [room] = await db
    .update(matchRoom)
    .set({ status: 'swiping' })
    .where(and(eq(matchRoom.code, code), eq(matchRoom.status, 'genres')))
    .returning();
  if (!room) return;

  const participants = await db.select().from(matchParticipant).where(eq(matchParticipant.roomCode, code));
  const voters = participants.filter((participant) => participant.ready);

  try {
    const deck = await buildDeckBatch(room.mediaType, voters.map((voter) => voter.genres), room.lang, [], 0);
    if (deck.length === 0) throw new MatchError('no_cards');

    await db.transaction(async (tx) => {
      await tx
        .update(matchParticipant)
        .set({ isVoter: sql`${matchParticipant.ready}` })
        .where(eq(matchParticipant.roomCode, code));
      await tx
        .update(matchRoom)
        .set({ deck, deckPages: 1, voterCount: voters.length })
        .where(eq(matchRoom.code, code));
    });
  } catch (error) {
    await db.update(matchRoom).set({ status: 'genres' }).where(eq(matchRoom.code, code));
    throw error;
  }
}

/* Swiping ------------------------------------------------------------- */

export async function vote(participant: Participant, cardIndex: number, liked: boolean) {
  const room = await getRoomOrThrow(participant.roomCode);
  if (room.status !== 'swiping') throw new MatchError('invalid_state');
  if (!participant.isVoter) throw new MatchError('not_voter');
  if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= room.deck.length) {
    throw new MatchError('invalid_card');
  }

  await db
    .insert(matchVote)
    .values({ roomCode: room.code, participantId: participant.id, cardIndex, liked })
    .onConflictDoUpdate({ target: [matchVote.participantId, matchVote.cardIndex], set: { liked } });

  if (liked && !room.matches.includes(cardIndex)) {
    const [{ likes }] = await db
      .select({ likes: sql<number>`count(*)::int` })
      .from(matchVote)
      .where(and(eq(matchVote.roomCode, room.code), eq(matchVote.cardIndex, cardIndex), eq(matchVote.liked, true)));

    if (likes >= majorityOf(room.voterCount)) {
      // Guarded update: only the first vote to cross the line announces the match.
      const [matched] = await db
        .update(matchRoom)
        .set({ status: 'matched', matches: sql`array_append(${matchRoom.matches}, ${cardIndex})` })
        .where(and(eq(matchRoom.code, room.code), eq(matchRoom.status, 'swiping')))
        .returning();
      if (matched) return;
    }
  }

  await finishIfDeckExhausted(room.code);
}

/** When every voter has gone through the whole deck without a new match, show the podium. */
async function finishIfDeckExhausted(code: string) {
  const room = await getRoomOrThrow(code);
  if (room.status !== 'swiping') return;

  const rows = await db
    .select({ participantId: matchVote.participantId, votes: sql<number>`count(*)::int` })
    .from(matchVote)
    .innerJoin(matchParticipant, eq(matchParticipant.id, matchVote.participantId))
    .where(and(eq(matchVote.roomCode, code), eq(matchParticipant.isVoter, true)))
    .groupBy(matchVote.participantId);

  const done = rows.filter((row) => row.votes >= room.deck.length).length;
  if (done >= room.voterCount) {
    await db
      .update(matchRoom)
      .set({ status: 'finished' })
      .where(and(eq(matchRoom.code, code), eq(matchRoom.status, 'swiping')));
  }
}

/** After a match, the host can keep looking for more options. */
export async function keepSwiping(participant: Participant) {
  requireHost(participant);
  const [room] = await db
    .update(matchRoom)
    .set({ status: 'swiping' })
    .where(and(eq(matchRoom.code, participant.roomCode), eq(matchRoom.status, 'matched')))
    .returning();
  if (!room) throw new MatchError('invalid_state');
  await finishIfDeckExhausted(room.code);
}

/** Appends another batch of cards when the deck ran out. */
export async function extendDeck(participant: Participant) {
  requireHost(participant);
  const room = await getRoomOrThrow(participant.roomCode);
  if (room.status !== 'finished' && room.status !== 'matched') throw new MatchError('invalid_state');

  const voters = await db
    .select({ genres: matchParticipant.genres })
    .from(matchParticipant)
    .where(and(eq(matchParticipant.roomCode, room.code), eq(matchParticipant.isVoter, true)));
  const batch = await buildDeckBatch(
    room.mediaType,
    voters.map((voter) => voter.genres),
    room.lang,
    room.deck,
    room.deckPages,
  );
  if (batch.length === 0) throw new MatchError('no_cards');

  await db
    .update(matchRoom)
    .set({ deck: [...room.deck, ...batch], deckPages: room.deckPages + 1, status: 'swiping' })
    .where(eq(matchRoom.code, room.code));
}

/* State --------------------------------------------------------------- */

export interface RankedCard {
  index: number;
  card: DeckCard;
  likes: number;
}

export interface RoomState {
  code: string;
  status: RoomStatus;
  mediaType: RoomMediaType;
  voterCount: number;
  majority: number;
  deck: DeckCard[];
  participants: {
    id: string;
    nickname: string;
    isHost: boolean;
    ready: boolean;
    isVoter: boolean;
    online: boolean;
    votes: number;
  }[];
  matches: RankedCard[];
  /** Most liked cards, for the podium when the deck runs out. */
  ranking: RankedCard[];
  me: { id: string; nickname: string; isHost: boolean; isVoter: boolean; ready: boolean; genres: number[]; votedCards: number[] };
}

/** Loads everything needed to render a room once, then personalizes per participant. */
export async function loadRoomSnapshot(code: string) {
  const [room] = await db.select().from(matchRoom).where(eq(matchRoom.code, code));
  if (!room) return null;
  const [participants, votes] = await Promise.all([
    db.select().from(matchParticipant).where(eq(matchParticipant.roomCode, code)).orderBy(asc(matchParticipant.joinedAt)),
    db.select().from(matchVote).where(eq(matchVote.roomCode, code)),
  ]);
  return { room, participants, votes };
}

export function personalizeState(
  snapshot: NonNullable<Awaited<ReturnType<typeof loadRoomSnapshot>>>,
  participantId: string,
  online: Set<string>,
): RoomState | null {
  const { room, participants, votes } = snapshot;
  const me = participants.find((participant) => participant.id === participantId);
  if (!me) return null;

  const likes = new Map<number, number>();
  const votesByParticipant = new Map<string, number>();
  for (const item of votes) {
    votesByParticipant.set(item.participantId, (votesByParticipant.get(item.participantId) ?? 0) + 1);
    if (item.liked) likes.set(item.cardIndex, (likes.get(item.cardIndex) ?? 0) + 1);
  }
  const ranked = (index: number): RankedCard => ({ index, card: room.deck[index], likes: likes.get(index) ?? 0 });
  const showDeck = room.status === 'swiping' || room.status === 'matched' || room.status === 'finished';

  return {
    code: room.code,
    status: room.status,
    mediaType: room.mediaType,
    voterCount: room.voterCount,
    majority: majorityOf(room.voterCount),
    deck: showDeck ? room.deck : [],
    participants: participants.map((participant) => ({
      id: participant.id,
      nickname: participant.nickname,
      isHost: participant.isHost,
      ready: participant.ready,
      isVoter: participant.isVoter,
      online: online.has(participant.id),
      votes: votesByParticipant.get(participant.id) ?? 0,
    })),
    matches: room.matches.filter((index) => room.deck[index]).map(ranked),
    ranking: [...likes.entries()]
      .filter(([index, count]) => count > 0 && room.deck[index])
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 3)
      .map(([index]) => ranked(index)),
    me: {
      id: me.id,
      nickname: me.nickname,
      isHost: me.isHost,
      isVoter: me.isVoter,
      ready: me.ready,
      genres: me.genres,
      votedCards: votes.filter((item) => item.participantId === me.id).map((item) => item.cardIndex),
    },
  };
}

export async function deleteExpiredRooms() {
  await db.delete(matchRoom).where(lt(matchRoom.expiresAt, new Date()));
}
