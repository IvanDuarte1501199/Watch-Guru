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

export interface DeckInput {
  mediaType: RoomMediaType;
  /** Each voter's genre picks. */
  picks: number[][];
  /** Union of the voters' streaming services. */
  providers: number[];
  region: string | null;
  lang: string;
  existing: DeckCard[];
  pagesFetched: number;
}

type Scored = { card: DeckCard; score: number };

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
  input: DeckInput,
  availability: { providers: number[]; region: string } | null,
): Promise<Scored[]> {
  const votes = genreVotes(kind, input.picks);
  // The most shared genres drive the query; the rest only affect ordering.
  const topGenres = [...votes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);

  const firstPage = input.pagesFetched * PAGES_PER_BATCH + 1;
  const [names, ...pages] = await Promise.all([
    genreNames(kind, input.lang),
    ...Array.from({ length: PAGES_PER_BATCH }, (_, i) =>
      tmdbGet<{ results: RawDiscoverItem[] }>(`/discover/${kind}`, {
        language: tmdbLanguage(input.lang),
        page: firstPage + i,
        sort_by: 'popularity.desc',
        include_adult: false,
        'vote_average.gte': 6.5,
        'vote_count.gte': kind === 'movie' ? 300 : 150,
        with_genres: topGenres.join('|'),
        ...(availability
          ? {
              with_watch_providers: availability.providers.join('|'),
              watch_region: availability.region,
              with_watch_monetization_types: 'flatrate',
            }
          : {}),
      }),
    ),
  ]);

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
        onGroupProviders: Boolean(availability),
      },
      // Titles that please more people first, with a little shuffle so decks feel fresh.
      score: item.genre_ids.reduce((sum, id) => sum + (votes.get(id) ?? 0), 0) + Math.random() * 1.5,
    }));
}

const cardKey = (card: DeckCard) => `${card.mediaType}:${card.tmdbId}`;

function freshSorted(candidates: Scored[], seen: Set<string>): DeckCard[] {
  const cards: DeckCard[] = [];
  for (const { card } of [...candidates].sort((a, b) => b.score - a.score)) {
    if (seen.has(cardKey(card))) continue;
    seen.add(cardKey(card));
    cards.push(card);
  }
  return cards;
}

/**
 * Builds the next batch of cards for a room from everyone's genre picks,
 * skipping titles already in the deck. Titles on the group's streaming
 * services come first; if there aren't enough, the rest of the catalog fills
 * the batch. Stored once so all participants swipe the same cards in order.
 */
export async function buildDeckBatch(input: DeckInput): Promise<DeckCard[]> {
  const kinds: MediaType[] = input.mediaType === 'both' ? ['movie', 'tv'] : [input.mediaType];
  const perKindTarget = Math.ceil(DECK_BATCH / kinds.length);
  const seen = new Set(input.existing.map(cardKey));
  const availability =
    input.providers.length > 0 && input.region ? { providers: input.providers, region: input.region } : null;

  const perKind: DeckCard[][] = [];
  for (const kind of kinds) {
    const available = availability ? freshSorted(await candidatesFor(kind, input, availability), seen) : [];
    const rest = available.length < perKindTarget ? freshSorted(await candidatesFor(kind, input, null), seen) : [];
    perKind.push([...available, ...rest]);
  }

  // Interleave movies and shows when the room wants both.
  const batch: DeckCard[] = [];
  for (let i = 0; batch.length < DECK_BATCH && perKind.some((list) => i < list.length); i++) {
    for (const list of perKind) if (list[i] && batch.length < DECK_BATCH) batch.push(list[i]);
  }
  return batch;
}
