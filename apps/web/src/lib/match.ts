'use client';

import type { MediaKind } from './tmdb/types';

/* Match rooms: types mirrored from apps/api/src/match/service.ts, plus HTTP helpers. */

export type RoomMediaType = MediaKind | 'both';
export type RoomStatus = 'lobby' | 'genres' | 'swiping' | 'matched' | 'finished';

export interface DeckCard {
  mediaType: MediaKind;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  year: string | null;
  voteAverage: number;
  genres: string[];
}

export interface RankedCard {
  index: number;
  card: DeckCard;
  likes: number;
}

export interface RoomParticipant {
  id: string;
  nickname: string;
  isHost: boolean;
  ready: boolean;
  isVoter: boolean;
  online: boolean;
  votes: number;
}

export interface RoomState {
  code: string;
  status: RoomStatus;
  mediaType: RoomMediaType;
  voterCount: number;
  majority: number;
  deck: DeckCard[];
  participants: RoomParticipant[];
  matches: RankedCard[];
  ranking: RankedCard[];
  me: {
    id: string;
    nickname: string;
    isHost: boolean;
    isVoter: boolean;
    ready: boolean;
    genres: number[];
    votedCards: number[];
  };
}

export interface RoomPreview {
  code: string;
  status: RoomStatus;
  mediaType: RoomMediaType;
  participants: number;
  host: string | null;
  joinable: boolean;
}

export type ClientMessage =
  | { type: 'start' }
  | { type: 'genres'; genres: number[] }
  | { type: 'begin-swiping' }
  | { type: 'vote'; index: number; liked: boolean }
  | { type: 'keep-swiping' }
  | { type: 'more-cards' };

export interface RoomCredentials {
  participantId: string;
  token: string;
}

export class MatchApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new MatchApiError(response.status, data.error ?? 'unknown');
  return data;
}

export const matchApi = {
  create: (input: { mediaType: RoomMediaType; lang: string; nickname?: string }) =>
    post<RoomCredentials & { code: string }>('/api/match/rooms', input),

  join: (code: string, nickname?: string) =>
    post<RoomCredentials & { code: string }>(`/api/match/rooms/${code}/join`, { nickname }),

  preview: async (code: string): Promise<RoomPreview | null> => {
    const response = await fetch(`/api/match/rooms/${code}`, { cache: 'no-store' });
    return response.ok ? ((await response.json()) as RoomPreview) : null;
  },
};

/* Room tokens live in localStorage so a refresh or a dropped connection keeps your seat. */

const storageKey = (code: string) => `watchguru:match:${code.toUpperCase()}`;

export function saveCredentials(code: string, credentials: RoomCredentials) {
  try {
    window.localStorage.setItem(storageKey(code), JSON.stringify(credentials));
  } catch {
    // Without storage the seat only lasts for this tab.
  }
}

export function loadCredentials(code: string): RoomCredentials | null {
  try {
    const raw = window.localStorage.getItem(storageKey(code));
    return raw ? (JSON.parse(raw) as RoomCredentials) : null;
  } catch {
    return null;
  }
}

export function clearCredentials(code: string) {
  try {
    window.localStorage.removeItem(storageKey(code));
  } catch {
    // Nothing to clear.
  }
}

export function matchSocketUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/api/match/ws`;
}

/** The next card this participant hasn't voted on, or null when they're done. */
export function nextCardIndex(state: RoomState, pending: Set<number>): number | null {
  const voted = new Set([...state.me.votedCards, ...pending]);
  for (let index = 0; index < state.deck.length; index++) if (!voted.has(index)) return index;
  return null;
}
