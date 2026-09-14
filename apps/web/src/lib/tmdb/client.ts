import 'server-only';
import { tmdbLanguage, type Locale } from '@/lib/i18n/config';

const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export class TmdbError extends Error {
  constructor(
    readonly status: number,
    path: string,
  ) {
    super(`TMDB responded ${status} for ${path}`);
    this.name = 'TmdbError';
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface TmdbFetchOptions {
  lang?: Locale;
  params?: Record<string, QueryValue>;
  /** Seconds the response stays in Next's data cache. */
  revalidate?: number;
}

export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;

/**
 * Server-side TMDB request. The API key never reaches the browser, and
 * responses are cached so repeated page views don't hit TMDB's rate limit.
 */
export async function tmdbFetch<T>(path: string, options: TmdbFetchOptions = {}): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY is not set');

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);
  if (options.lang) url.searchParams.set('language', tmdbLanguage[options.lang]);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, { next: { revalidate: options.revalidate ?? HOUR } });
  if (!response.ok) throw new TmdbError(response.status, path);
  return (await response.json()) as T;
}

/** Same as `tmdbFetch` but resolves to `null` when TMDB answers 404. */
export async function tmdbFetchOrNull<T>(path: string, options: TmdbFetchOptions = {}): Promise<T | null> {
  try {
    return await tmdbFetch<T>(path, options);
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) return null;
    throw error;
  }
}
