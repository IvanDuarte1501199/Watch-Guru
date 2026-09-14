import 'server-only';
import { cookies } from 'next/headers';
import type { MediaKind } from './tmdb/types';

const API_URL = process.env.API_URL || 'http://localhost:4000';

export interface PublicList {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  ownerName: string;
  isOwner: boolean;
  updatedAt: string;
  items: {
    mediaType: MediaKind;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
  }[];
}

/**
 * Loads a custom list. The viewer's cookies are forwarded so owners can open
 * their private lists; everyone else only gets public ones.
 */
export async function getList(id: string): Promise<PublicList | null> {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${API_URL}/api/lists/${id}`, {
      headers: { cookie: cookieStore.toString() },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? ((await response.json()) as PublicList) : null;
  } catch {
    return null;
  }
}

/** Recently updated public lists, for the sitemap. Empty when the API is unreachable (e.g. at build time). */
export async function getPublicLists(limit = 100): Promise<{ id: string; title: string; updatedAt: string }[]> {
  try {
    const response = await fetch(`${API_URL}/api/lists?limit=${limit}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];
    return ((await response.json()) as { lists: { id: string; title: string; updatedAt: string }[] }).lists;
  } catch {
    return [];
  }
}

/**
 * Asks the backend for a pick based on the signed-in user's taste, forwarding
 * their session cookie. Resolves to null for guests or when the backend has
 * nothing to suggest, so callers can fall back to a generic pick.
 */
export async function personalPick(kind: MediaKind): Promise<number | null> {
  const cookieStore = await cookies();
  if (!cookieStore.getAll().some((cookie) => cookie.name.includes('session_token'))) return null;

  try {
    const response = await fetch(`${API_URL}/api/me/recommendations/random?type=${kind}`, {
      headers: { cookie: cookieStore.toString() },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { tmdbId?: number };
    return typeof data.tmdbId === 'number' ? data.tmdbId : null;
  } catch {
    return null;
  }
}
