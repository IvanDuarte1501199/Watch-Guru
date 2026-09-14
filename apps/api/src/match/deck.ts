import type { DeckCard, MediaType, RoomMediaType } from '../db/schema.js';
import { genresFor } from '../lib/recommendations.js';
import { tmdbGet } from '../lib/tmdb.js';

const DECK_BATCH = 40;
/** Discover pages fetched per media type each time the deck grows. */
const PAGES_PER_BATCH = 2;

const tmdbLanguage = (lang: string) => (lang === 'en' ? 'en-US' : 'es-ES');

interface RawDiscoverItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

async function genreNames(kind: MediaType, lang: string): Promise<Map<number, string>> {
  const data = await tmdbGet<{ genres: { id: number; name: string }[] }>(`/genre/${kind}/list`, {
    language: tmdbLanguage(lang),
  });
  return new Map(data.genres.map((genre) => [genre.id, genre.name]));
}

/** How many participants picked each genre, translated to this media type's genre ids. */
function genreVotes(kind: MediaType, picks: number[][]): Map<number, number> {
  const votes = new Map<number, number>();
  for (const participantGenres of picks) {
    for (const id of genresFor(kind, participantGenres)) votes.set(id, (votes.get(id) ?? 0) + 1);
  }
  return votes;
}

async function candidatesFor(
  kind: MediaType,
  picks: number[][],
  lang: string,
  firstPage: number,
): Promise<{ card: DeckCard; score: number }[]> {
  const votes = genreVotes(kind, picks);
  // The most shared genres drive the query; the rest only affect ordering.
  const topGenres = [...votes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);

  const names = await genreNames(kind, lang);
  const pages = await Promise.all(
    Array.from({ length: PAGES_PER_BATCH }, (_, i) =>
      tmdbGet<{ results: RawDiscoverItem[] }>(`/discover/${kind}`, {
        language: tmdbLanguage(lang),
        page: firstPage + i,
        sort_by: 'popularity.desc',
        include_adult: false,
        'vote_average.gte': 6.5,
        'vote_count.gte': kind === 'movie' ? 300 : 150,
        with_genres: topGenres.join('|'),
      }),
    ),
  );

  return pages
    .flatMap((page) => page.results)
    .filter((item) => item.poster_path)
    .map((item) => ({
      card: {
        mediaType: kind,
        tmdbId: item.id,
        title: item.title ?? item.name ?? '',
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        overview: item.overview,
        year: (item.release_date || item.first_air_date || '').slice(0, 4) || null,
        voteAverage: item.vote_average,
        genres: item.genre_ids.map((id) => names.get(id)).filter((name): name is string => Boolean(name)).slice(0, 3),
      },
      // Titles that please more people first, with a little shuffle so decks feel fresh.
      score: item.genre_ids.reduce((sum, id) => sum + (votes.get(id) ?? 0), 0) + Math.random() * 1.5,
    }));
}

/**
 * Builds the next batch of cards for a room from everyone's genre picks,
 * skipping titles already in the deck. Stored once so all participants
 * swipe through the same cards in the same order.
 */
export async function buildDeckBatch(
  mediaType: RoomMediaType,
  picks: number[][],
  lang: string,
  existing: DeckCard[],
  pagesFetched: number,
): Promise<DeckCard[]> {
  const kinds: MediaType[] = mediaType === 'both' ? ['movie', 'tv'] : [mediaType];
  const seen = new Set(existing.map((card) => `${card.mediaType}:${card.tmdbId}`));
  const firstPage = pagesFetched * PAGES_PER_BATCH + 1;

  const perKind = await Promise.all(
    kinds.map(async (kind) =>
      (await candidatesFor(kind, picks, lang, firstPage))
        .filter(({ card }) => !seen.has(`${card.mediaType}:${card.tmdbId}`))
        .sort((a, b) => b.score - a.score)
        .map(({ card }) => card),
    ),
  );

  // Interleave movies and shows when the room wants both.
  const batch: DeckCard[] = [];
  for (let i = 0; batch.length < DECK_BATCH && perKind.some((list) => i < list.length); i++) {
    for (const list of perKind) if (list[i] && batch.length < DECK_BATCH) batch.push(list[i]);
  }
  return batch;
}
