import 'server-only';
import { cookies } from 'next/headers';
import type { MediaKind } from './tmdb/types';

const API_URL = process.env.API_URL || 'http://localhost:4000';

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
