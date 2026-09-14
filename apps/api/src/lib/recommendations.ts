import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { libraryEntry, tasteProfile, type MediaType } from '../db/schema.js';
import { tmdbGet } from './tmdb.js';

/*
 * TMDB uses different genre ids for movies and TV (e.g. movies have Action=28
 * and Adventure=12, TV has a single "Action & Adventure"=10759). Tastes are
 * stored as picked, so translate them to the kind being recommended.
 */
const MOVIE_GENRES = new Set([28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]);
const TV_GENRES = new Set([10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37]);

const TV_TO_MOVIE: Record<number, number[]> = { 10759: [28, 12], 10765: [878, 14], 10768: [10752], 10762: [10751] };
const MOVIE_TO_TV: Record<number, number[]> = { 28: [10759], 12: [10759], 878: [10765], 14: [10765], 10752: [10768] };

export function genresFor(kind: MediaType, ids: number[]): number[] {
  const valid = kind === 'movie' ? MOVIE_GENRES : TV_GENRES;
  const mapping = kind === 'movie' ? TV_TO_MOVIE : MOVIE_TO_TV;
  const result = new Set<number>();
  for (const id of ids) {
    if (valid.has(id)) result.add(id);
    for (const mapped of mapping[id] ?? []) result.add(mapped);
  }
  return [...result];
}

interface DiscoverPage {
  page: number;
  total_pages: number;
  results: { id: number }[];
}

const randomInt = (max: number) => Math.floor(Math.random() * max);

/** Genres that show up most in titles the user rated 8+ (4 stars or more). */
function favoriteGenresFromRatings(entries: { rating: number | null; genreIds: number[] }[]): number[] {
  const counts = new Map<number, number>();
  for (const entry of entries) {
    if ((entry.rating ?? 0) < 8) continue;
    for (const id of entry.genreIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);
}

export interface PersonalPick {
  tmdbId: number;
  genres: number[];
  usedProviders: boolean;
}

export async function pickForUser(userId: string, kind: MediaType): Promise<PersonalPick | null> {
  const [[taste], entries] = await Promise.all([
    db.select().from(tasteProfile).where(eq(tasteProfile.userId, userId)),
    db
      .select({
        tmdbId: libraryEntry.tmdbId,
        status: libraryEntry.status,
        rating: libraryEntry.rating,
        genreIds: libraryEntry.genreIds,
      })
      .from(libraryEntry)
      .where(and(eq(libraryEntry.userId, userId), eq(libraryEntry.mediaType, kind))),
  ]);

  // Don't recommend what they've already seen, rated or started.
  const excluded = new Set(entries.filter((entry) => entry.status !== 'watchlist' || entry.rating).map((e) => e.tmdbId));

  const liked = genresFor(kind, [...(taste?.likedGenres ?? []), ...favoriteGenresFromRatings(entries)]);
  const disliked = genresFor(kind, taste?.dislikedGenres ?? []).filter((id) => !liked.includes(id));
  const providers = taste?.providers ?? [];
  const region = taste?.region ?? undefined;

  const base = {
    include_adult: false,
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.5,
    'vote_count.gte': kind === 'movie' ? 200 : 100,
    without_genres: disliked.join(','),
  };

  // Loosen constraints step by step if a combination yields nothing new.
  const attempts = [
    { with_genres: liked.join('|'), providers: true },
    { with_genres: liked.join('|'), providers: false },
    { with_genres: '', providers: false },
  ].filter((attempt) => !attempt.providers || (providers.length > 0 && region));

  for (const attempt of attempts) {
    const params = {
      ...base,
      with_genres: attempt.with_genres,
      ...(attempt.providers
        ? { with_watch_providers: providers.join('|'), watch_region: region, with_watch_monetization_types: 'flatrate' }
        : {}),
    };

    const first = await tmdbGet<DiscoverPage>(`/discover/${kind}`, { ...params, page: 1 });
    if (first.results.length === 0) continue;

    const maxPage = Math.min(first.total_pages, 15);
    for (let tries = 0; tries < 3; tries++) {
      const page = 1 + randomInt(maxPage);
      const data = page === 1 ? first : await tmdbGet<DiscoverPage>(`/discover/${kind}`, { ...params, page });
      const candidates = data.results.filter((result) => !excluded.has(result.id));
      if (candidates.length > 0) {
        return {
          tmdbId: candidates[randomInt(candidates.length)].id,
          genres: attempt.with_genres ? liked : [],
          usedProviders: attempt.providers,
        };
      }
    }
  }
  return null;
}
