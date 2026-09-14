import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ROOM_MEDIA_TYPES } from '../db/schema.js';
import { env } from '../env.js';
import { getSessionUser } from '../lib/session.js';
import { addConnection, broadcastRoom, removeConnection, send } from '../match/hub.js';
import {
  authenticate,
  createRoom,
  extendDeck,
  getParticipant,
  joinRoom,
  keepSwiping,
  MatchError,
  normalizeCode,
  roomPreview,
  startGenres,
  startSwiping,
  submitGenres,
  vote,
} from '../match/service.js';

const nickname = z.string().trim().min(1).max(24);
const codeParam = z.object({ code: z.string().min(4).max(12).transform(normalizeCode) });

const createBody = z.object({
  mediaType: z.enum(ROOM_MEDIA_TYPES),
  lang: z.enum(['es', 'en']).default('es'),
  nickname: nickname.optional(),
});

const joinBody = z.object({ nickname: nickname.optional() });

const clientMessage = z.discriminatedUnion('type', [
  z.object({ type: z.literal('auth'), code: z.string().max(12), token: z.string().max(100) }),
  z.object({ type: z.literal('start') }),
  z.object({ type: z.literal('genres'), genres: z.array(z.number().int().positive()).max(30) }),
  z.object({ type: z.literal('begin-swiping') }),
  z.object({ type: z.literal('vote'), index: z.number().int().min(0), liked: z.boolean() }),
  z.object({ type: z.literal('keep-swiping') }),
  z.object({ type: z.literal('more-cards') }),
]);

const AUTH_TIMEOUT_MS = 10_000;

const matchErrorStatus: Record<MatchError['code'], number> = {
  room_not_found: 404,
  room_full: 409,
  room_closed: 409,
  not_host: 403,
  invalid_state: 409,
  not_voter: 403,
  invalid_card: 400,
  no_cards: 422,
};

export async function matchRoutes(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof MatchError) return reply.status(matchErrorStatus[error.code]).send({ error: error.code });
    throw error;
  });

  const writeLimit = { rateLimit: { max: 20, timeWindow: '1 minute' } };

  app.post('/api/match/rooms', { config: writeLimit }, async (request, reply) => {
    const body = createBody.parse(request.body ?? {});
    const user = await getSessionUser(request);
    const name = body.nickname ?? user?.name;
    if (!name) return reply.status(400).send({ error: 'nickname_required' });

    const { room, participant, token } = await createRoom({
      mediaType: body.mediaType,
      lang: body.lang,
      nickname: name.slice(0, 24),
      userId: user?.id ?? null,
    });
    return reply.status(201).send({ code: room.code, participantId: participant.id, token });
  });

  app.get('/api/match/rooms/:code', async (request) => {
    const { code } = codeParam.parse(request.params);
    return roomPreview(code);
  });

  app.post('/api/match/rooms/:code/join', { config: writeLimit }, async (request, reply) => {
    const { code } = codeParam.parse(request.params);
    const body = joinBody.parse(request.body ?? {});
    const user = await getSessionUser(request);
    const name = body.nickname ?? user?.name;
    if (!name) return reply.status(400).send({ error: 'nickname_required' });

    const { participant, token } = await joinRoom(code, { nickname: name.slice(0, 24), userId: user?.id ?? null });
    await broadcastRoom(code);
    return { code, participantId: participant.id, token };
  });

  /*
   * Realtime channel. The browser connects straight to the API (hosting
   * rewrites don't proxy WebSockets), so the room token is sent in the first
   * message rather than the URL, keeping it out of access logs.
   */
  app.get('/api/match/ws', { websocket: true }, (socket, request) => {
    const origin = request.headers.origin;
    if (origin && origin !== env.WEB_URL) {
      socket.close(1008, 'origin');
      return;
    }

    let session: { code: string; participantId: string } | null = null;
    const authTimer = setTimeout(() => !session && socket.close(4001, 'auth_timeout'), AUTH_TIMEOUT_MS);
    // Messages are handled one at a time so votes from the same client apply in order.
    let queue = Promise.resolve();

    socket.on('message', (raw) => {
      queue = queue.then(async () => {
        let message: z.infer<typeof clientMessage>;
        try {
          message = clientMessage.parse(JSON.parse(raw.toString()));
        } catch {
          send(socket, { type: 'error', error: 'invalid_message' });
          return;
        }

        try {
          if (message.type === 'auth') {
            const code = normalizeCode(message.code);
            const participant = await authenticate(code, message.token);
            if (!participant) {
              socket.close(4003, 'unauthorized');
              return;
            }
            clearTimeout(authTimer);
            if (session) removeConnection(session.code, socket);
            session = { code, participantId: participant.id };
            addConnection(code, socket, participant.id);
            await broadcastRoom(code);
            return;
          }

          if (!session) {
            send(socket, { type: 'error', error: 'unauthorized' });
            return;
          }
          // Re-read so host/voter flags reflect the latest room state.
          const current = await getParticipant(session.participantId);
          if (!current) {
            socket.close(4004, 'gone');
            return;
          }

          switch (message.type) {
            case 'start':
              await startGenres(current);
              break;
            case 'genres':
              await submitGenres(current, message.genres);
              break;
            case 'begin-swiping':
              await startSwiping(current);
              break;
            case 'vote':
              await vote(current, message.index, message.liked);
              break;
            case 'keep-swiping':
              await keepSwiping(current);
              break;
            case 'more-cards':
              await extendDeck(current);
              break;
          }
          await broadcastRoom(session.code);
        } catch (error) {
          if (error instanceof MatchError) {
            send(socket, { type: 'error', error: error.code });
          } else {
            request.log.error(error);
            send(socket, { type: 'error', error: 'internal_error' });
          }
        }
      });
    });

    socket.on('close', () => {
      clearTimeout(authTimer);
      if (!session) return;
      const { code } = session;
      removeConnection(code, socket);
      void broadcastRoom(code).catch(() => undefined);
    });
  });
}
