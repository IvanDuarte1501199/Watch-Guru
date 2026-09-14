import { env } from '../env.js';

type QueryValue = string | number | boolean | undefined | null;

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const cache = new Map<string, CacheEntry>();

export class TmdbError extends Error {
  constructor(
    readonly status: number,
    path: string,
  ) {
    super(`TMDB responded ${status} for ${path}`);
  }
}

/** Small TMDB client with an in-memory cache (discover pages change slowly). */
export async function tmdbGet<T>(path: string, params: Record<string, QueryValue> = {}): Promise<T> {
  const url = new URL(`${env.TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  const cacheKey = url.toString();
  url.searchParams.set('api_key', env.TMDB_API_KEY);

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value as T;

  const response = await fetch(url);
  if (!response.ok) throw new TmdbError(response.status, path);
  const value = (await response.json()) as T;

  if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
  cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
