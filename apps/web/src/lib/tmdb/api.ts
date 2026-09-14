import 'server-only';
import type { Locale } from '@/lib/i18n/config';
import { DAY, tmdbFetch, tmdbFetchOrNull } from './client';
import type {
  CastMember,
  Country,
  Episode,
  Genre,
  MediaKind,
  MediaSummary,
  MovieDetail,
  Paged,
  PersonDetail,
  PersonSummary,
  Provider,
  ProvidersByCountry,
  SearchResult,
  Season,
  TvDetail,
  Video,
} from './types';

/* ------------------------------------------------------------------ */
/* Raw TMDB shapes (only the fields we read)                           */
/* ------------------------------------------------------------------ */

interface RawMedia {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Genre[];
  popularity?: number;
}

interface RawPerson {
  id: number;
  media_type?: string;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}

interface RawDetailAppends {
  tagline?: string;
  videos?: { results: Video[] };
  recommendations?: Paged<RawMedia>;
  'watch/providers'?: { results: ProvidersByCountry };
}

interface RawMovieDetail extends RawMedia, RawDetailAppends {
  runtime?: number | null;
  imdb_id?: string | null;
  credits?: { cast: CastMember[]; crew?: { id: number; name: string; job: string }[] };
}

interface RawTvDetail extends RawMedia, RawDetailAppends {
  created_by?: { id: number; name: string }[];
  seasons?: Season[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  aggregate_credits?: {
    cast: { id: number; name: string; profile_path: string | null; roles?: { character: string }[] }[];
  };
}

/* ------------------------------------------------------------------ */
/* Normalizers                                                         */
/* ------------------------------------------------------------------ */

function toMediaSummary(raw: RawMedia, fallbackKind: MediaKind): MediaSummary {
  const kind: MediaKind = raw.media_type === 'tv' || raw.media_type === 'movie' ? raw.media_type : fallbackKind;
  return {
    id: raw.id,
    media_type: kind,
    title: raw.title ?? raw.name ?? '',
    original_title: raw.original_title ?? raw.original_name ?? '',
    overview: raw.overview ?? '',
    poster_path: raw.poster_path ?? null,
    backdrop_path: raw.backdrop_path ?? null,
    vote_average: raw.vote_average ?? 0,
    vote_count: raw.vote_count ?? 0,
    release_date: (raw.release_date || raw.first_air_date) ?? null,
    genre_ids: raw.genre_ids ?? raw.genres?.map((genre) => genre.id) ?? [],
    popularity: raw.popularity ?? 0,
  };
}

const toPersonSummary = (raw: RawPerson): PersonSummary => ({
  id: raw.id,
  name: raw.name,
  profile_path: raw.profile_path,
  known_for_department: raw.known_for_department ?? '',
});

function mapPaged(data: Paged<RawMedia>, kind: MediaKind): Paged<MediaSummary> {
  return { ...data, results: data.results.map((item) => toMediaSummary(item, kind)) };
}

const videoLanguages = (lang: Locale) => (lang === 'en' ? 'en,null' : `${lang},en,null`);

function sortVideos(videos: Video[]): Video[] {
  const rank = (video: Video) => (video.type === 'Trailer' ? 0 : video.type === 'Teaser' ? 1 : 2);
  return videos.filter((video) => video.site === 'YouTube').sort((a, b) => rank(a) - rank(b));
}

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

export const movieCategories = ['trending', 'now-playing', 'popular', 'top-rated', 'upcoming'] as const;
export const tvCategories = ['trending', 'airing-today', 'on-the-air', 'popular', 'top-rated'] as const;

export type MovieCategory = (typeof movieCategories)[number];
export type TvCategory = (typeof tvCategories)[number];

const categoryPaths = {
  movie: {
    trending: '/trending/movie/week',
    'now-playing': '/movie/now_playing',
    popular: '/movie/popular',
    'top-rated': '/movie/top_rated',
    upcoming: '/movie/upcoming',
  } satisfies Record<MovieCategory, string>,
  tv: {
    trending: '/trending/tv/week',
    'airing-today': '/tv/airing_today',
    'on-the-air': '/tv/on_the_air',
    popular: '/tv/popular',
    'top-rated': '/tv/top_rated',
  } satisfies Record<TvCategory, string>,
};

export function isCategory(kind: MediaKind, value: string): value is MovieCategory | TvCategory {
  return value in categoryPaths[kind];
}

export async function getCategory(
  kind: MediaKind,
  category: MovieCategory | TvCategory,
  lang: Locale,
  page = 1,
): Promise<Paged<MediaSummary>> {
  const path = (categoryPaths[kind] as Record<string, string>)[category];
  const data = await tmdbFetch<Paged<RawMedia>>(path, { lang, params: { page } });
  return mapPaged(data, kind);
}

export async function getTrendingAll(lang: Locale, page = 1): Promise<Paged<MediaSummary>> {
  const data = await tmdbFetch<Paged<RawMedia>>('/trending/all/week', { lang, params: { page } });
  const results = data.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item) => toMediaSummary(item, 'movie'));
  return { ...data, results };
}

export async function getTrendingPeople(lang: Locale): Promise<PersonSummary[]> {
  const data = await tmdbFetch<Paged<RawPerson>>('/trending/person/week', { lang });
  return data.results.map(toPersonSummary);
}

export async function getGenres(kind: MediaKind, lang: Locale): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>(`/genre/${kind}/list`, { lang, revalidate: DAY });
  return data.genres;
}

export const movieSortOptions = ['popularity', 'primary_release_date', 'vote_average', 'vote_count', 'revenue'] as const;
export const tvSortOptions = ['popularity', 'first_air_date', 'vote_average', 'vote_count'] as const;

export interface DiscoverParams {
  genres?: number[];
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  /** Only titles streaming (flat-rate) on any of these services in `region`. */
  providers?: number[];
  region?: string;
  minVotes?: number;
  /** ISO dates (YYYY-MM-DD) bounding the release / first air date. */
  releasedAfter?: string;
  releasedBefore?: string;
}

export async function discover(kind: MediaKind, lang: Locale, params: DiscoverParams = {}) {
  const sortBy = params.sortBy ?? 'popularity';
  const byProvider = Boolean(params.providers?.length && params.region);
  const data = await tmdbFetch<Paged<RawMedia>>(`/discover/${kind}`, {
    lang,
    params: {
      page: params.page ?? 1,
      sort_by: `${sortBy}.${params.order ?? 'desc'}`,
      with_genres: params.genres?.join(','),
      include_adult: false,
      // Rating-based sorts are meaningless for titles with a handful of votes.
      'vote_count.gte': params.minVotes ?? (sortBy === 'vote_average' ? 200 : undefined),
      with_watch_providers: byProvider ? params.providers!.join('|') : undefined,
      watch_region: byProvider ? params.region : undefined,
      with_watch_monetization_types: byProvider ? 'flatrate' : undefined,
      [kind === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte']: params.releasedAfter,
      [kind === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte']: params.releasedBefore,
    },
  });
  return mapPaged(data, kind);
}

/* ------------------------------------------------------------------ */
/* Details                                                             */
/* ------------------------------------------------------------------ */

export async function getMovie(id: number, lang: Locale): Promise<MovieDetail | null> {
  const raw = await tmdbFetchOrNull<RawMovieDetail>(`/movie/${id}`, {
    lang,
    params: {
      append_to_response: 'credits,videos,recommendations,watch/providers',
      include_video_language: videoLanguages(lang),
    },
  });
  if (!raw) return null;

  return {
    ...toMediaSummary(raw, 'movie'),
    media_type: 'movie',
    genres: raw.genres ?? [],
    tagline: raw.tagline ?? '',
    runtime: raw.runtime ?? null,
    imdb_id: raw.imdb_id ?? null,
    cast: raw.credits?.cast ?? [],
    creators: (raw.credits?.crew ?? [])
      .filter((member) => member.job === 'Director')
      .map(({ id, name }) => ({ id, name })),
    videos: sortVideos(raw.videos?.results ?? []),
    recommendations: (raw.recommendations?.results ?? []).map((item) => toMediaSummary(item, 'movie')),
    providers: raw['watch/providers']?.results ?? {},
  };
}

export async function getTvShow(id: number, lang: Locale): Promise<TvDetail | null> {
  const raw = await tmdbFetchOrNull<RawTvDetail>(`/tv/${id}`, {
    lang,
    params: {
      append_to_response: 'aggregate_credits,videos,recommendations,watch/providers',
      include_video_language: videoLanguages(lang),
    },
  });
  if (!raw) return null;

  return {
    ...toMediaSummary(raw, 'tv'),
    media_type: 'tv',
    genres: raw.genres ?? [],
    tagline: raw.tagline ?? '',
    // Specials (season 0) go last.
    seasons: [...(raw.seasons ?? [])].sort(
      (a, b) => (a.season_number || Number.MAX_SAFE_INTEGER) - (b.season_number || Number.MAX_SAFE_INTEGER),
    ),
    number_of_seasons: raw.number_of_seasons ?? 0,
    number_of_episodes: raw.number_of_episodes ?? 0,
    episode_run_time: raw.episode_run_time ?? [],
    status: raw.status ?? '',
    creators: (raw.created_by ?? []).map(({ id, name }) => ({ id, name })),
    cast: (raw.aggregate_credits?.cast ?? []).map((member) => ({
      id: member.id,
      name: member.name,
      profile_path: member.profile_path,
      character: member.roles?.[0]?.character ?? '',
    })),
    videos: sortVideos(raw.videos?.results ?? []),
    recommendations: (raw.recommendations?.results ?? []).map((item) => toMediaSummary(item, 'tv')),
    providers: raw['watch/providers']?.results ?? {},
  };
}

/** Recommendations for a title, falling back to TMDB's "similar" list when there are none. */
export async function getRecommendations(kind: MediaKind, id: number, lang: Locale, pages = 2): Promise<MediaSummary[]> {
  const fetchList = (list: 'recommendations' | 'similar') =>
    Promise.all(
      Array.from({ length: pages }, (_, index) =>
        tmdbFetchOrNull<Paged<RawMedia>>(`/${kind}/${id}/${list}`, { lang, params: { page: index + 1 } }),
      ),
    ).then((responses) => responses.flatMap((response) => response?.results ?? []));

  let raw = await fetchList('recommendations');
  if (raw.length === 0) raw = await fetchList('similar');
  const unique = new Map<string, MediaSummary>();
  for (const item of raw) {
    const summary = toMediaSummary(item, kind);
    unique.set(`${summary.media_type}:${summary.id}`, summary);
  }
  return [...unique.values()].filter((item) => item.poster_path);
}

/** TMDB allows up to 20 appended resources per request, so seasons are fetched in chunks. */
export async function getSeasonEpisodes(
  tvId: number,
  seasonNumbers: number[],
  lang: Locale,
): Promise<Record<number, Episode[]>> {
  const chunks: number[][] = [];
  for (let i = 0; i < seasonNumbers.length; i += 20) chunks.push(seasonNumbers.slice(i, i + 20));

  const responses = await Promise.all(
    chunks.map((chunk) =>
      tmdbFetch<Record<string, { episodes?: Episode[] } | undefined>>(`/tv/${tvId}`, {
        lang,
        params: { append_to_response: chunk.map((number) => `season/${number}`).join(',') },
      }),
    ),
  );

  const episodes: Record<number, Episode[]> = {};
  responses.forEach((response, index) => {
    for (const number of chunks[index]) {
      episodes[number] = response[`season/${number}`]?.episodes ?? [];
    }
  });
  return episodes;
}

interface RawPersonDetail extends RawPerson {
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  homepage?: string | null;
  movie_credits?: { cast: RawMedia[]; crew: (RawMedia & { job?: string })[] };
  tv_credits?: { cast: RawMedia[]; crew: (RawMedia & { job?: string })[] };
}

function personCredits(
  credits: { cast: RawMedia[]; crew: RawMedia[] } | undefined,
  kind: MediaKind,
  includeCrew: boolean,
): MediaSummary[] {
  if (!credits) return [];
  const all = includeCrew ? [...credits.cast, ...credits.crew] : credits.cast;
  const unique = new Map<number, MediaSummary>();
  for (const item of all) {
    if (!unique.has(item.id)) unique.set(item.id, toMediaSummary(item, kind));
  }
  return [...unique.values()].sort((a, b) => b.popularity - a.popularity);
}

export async function getPerson(id: number, lang: Locale): Promise<PersonDetail | null> {
  const raw = await tmdbFetchOrNull<RawPersonDetail>(`/person/${id}`, {
    lang,
    params: { append_to_response: 'movie_credits,tv_credits' },
  });
  if (!raw) return null;

  let biography = raw.biography ?? '';
  if (!biography && lang !== 'en') {
    const english = await tmdbFetchOrNull<RawPersonDetail>(`/person/${id}`, { lang: 'en' });
    biography = english?.biography ?? '';
  }

  const includeCrew = raw.known_for_department !== 'Acting';
  return {
    ...toPersonSummary(raw),
    biography,
    birthday: raw.birthday ?? null,
    deathday: raw.deathday ?? null,
    place_of_birth: raw.place_of_birth ?? null,
    homepage: raw.homepage ?? null,
    movies: personCredits(raw.movie_credits, 'movie', includeCrew),
    tvShows: personCredits(raw.tv_credits, 'tv', includeCrew),
  };
}

interface RawWatchProvider extends Provider {
  display_priorities?: Record<string, number>;
}

/** Streaming services available in a region, for movies and TV combined, most relevant first. */
export async function getWatchProviders(region: string, lang: Locale): Promise<Provider[]> {
  const [movies, tv] = await Promise.all(
    (['movie', 'tv'] as const).map((kind) =>
      tmdbFetch<{ results: RawWatchProvider[] }>(`/watch/providers/${kind}`, {
        lang,
        revalidate: DAY,
        params: { watch_region: region },
      }),
    ),
  );

  const byId = new Map<number, Provider>();
  for (const provider of [...movies.results, ...tv.results]) {
    if (byId.has(provider.provider_id)) continue;
    byId.set(provider.provider_id, {
      provider_id: provider.provider_id,
      provider_name: provider.provider_name,
      logo_path: provider.logo_path,
      display_priority: provider.display_priorities?.[region] ?? provider.display_priority ?? 999,
    });
  }
  return [...byId.values()].sort((a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999));
}

export async function getCountries(lang: Locale): Promise<Country[]> {
  return tmdbFetch<Country[]>('/configuration/countries', { lang, revalidate: DAY });
}

/* ------------------------------------------------------------------ */
/* Search & random                                                     */
/* ------------------------------------------------------------------ */

export async function searchMulti(query: string, lang: Locale, page = 1): Promise<Paged<SearchResult>> {
  const data = await tmdbFetch<Paged<RawMedia & RawPerson>>('/search/multi', {
    lang,
    params: { query, page, include_adult: false },
  });

  const results: SearchResult[] = [];
  for (const item of data.results) {
    if (item.media_type === 'person') {
      results.push({ ...toPersonSummary(item), kind: 'person', media_type: 'person' });
    } else if (item.media_type === 'movie' || item.media_type === 'tv') {
      results.push({ ...toMediaSummary(item, item.media_type), kind: 'media' });
    }
  }
  return { ...data, results };
}

/** Picks a random well-rated title. Candidate pages are cached; the pick is not. */
export async function getRandomMediaId(kind: MediaKind, lang: Locale): Promise<number | null> {
  const page = Math.floor(Math.random() * 8) + 1;
  const data = await tmdbFetch<Paged<RawMedia>>(`/discover/${kind}`, {
    lang,
    revalidate: DAY,
    params: { page, 'vote_average.gte': 7.2, 'vote_count.gte': 150, include_adult: false },
  });
  if (data.results.length === 0) return null;
  return data.results[Math.floor(Math.random() * data.results.length)].id;
}
