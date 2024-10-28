import { Genre } from '@appTypes/genres/genre';
import { MediaType } from '../common/MediaType';

export interface MovieProps {
  tagline: any;
  genres: Genre[];
  runtime: any;
  backdrop_path: string;
  id: string;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: MediaType;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: Date;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MoviesState {
  movies: MovieProps[];
  loading: boolean;
  error: string | null;
}

export enum MovieType {
  Popular = 'popular',
  NowPlaying = 'now-Playing',
  TopRated = 'top-Rated',
  Upcoming = 'upcoming',
  Trending = 'trending',
  ByCategory = 'byCategory',
  ByKeyword = 'byKeyword',
}
