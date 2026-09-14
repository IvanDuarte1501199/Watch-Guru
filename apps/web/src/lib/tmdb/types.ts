export type MediaKind = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface Paged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Movie or TV show normalized to a single shape (TV `name` → `title`, etc). */
export interface MediaSummary {
  id: number;
  media_type: MediaKind;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string | null;
  genre_ids: number[];
  popularity: number;
}

export interface PersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export type SearchResult =
  | (MediaSummary & { kind: 'media' })
  | (PersonSummary & { kind: 'person'; media_type: 'person' });

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

export interface CountryProviders {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

export type ProvidersByCountry = Record<string, CountryProviders>;

interface DetailExtras {
  genres: Genre[];
  /** Directors for movies, creators for TV shows. */
  creators: { id: number; name: string }[];
  tagline: string;
  cast: CastMember[];
  videos: Video[];
  recommendations: MediaSummary[];
  providers: ProvidersByCountry;
}

export interface MovieDetail extends MediaSummary, DetailExtras {
  media_type: 'movie';
  runtime: number | null;
  imdb_id: string | null;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  vote_average: number;
  still_path: string | null;
}

export interface TvDetail extends MediaSummary, DetailExtras {
  media_type: 'tv';
  seasons: Season[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
}

export type MediaDetail = MovieDetail | TvDetail;

export interface PersonDetail extends PersonSummary {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  homepage: string | null;
  movies: MediaSummary[];
  tvShows: MediaSummary[];
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}
