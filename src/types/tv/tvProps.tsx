import { Genre } from '@appTypes/genres/genre';
import { MediaType } from '../common/MediaType';

export interface TvProps {
  genres: Genre[];
  seasons: any;
  backdrop_path: string;
  id: string;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: MediaType;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: Date;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export interface TvShowsState {
  tvShows: TvProps[];
  loading: boolean;
  error: string | null;
}

export enum TvShowType {
  AiringToday = 'airingToday',
  OnTheAir = 'onTheAir',
  Popular = 'popularTv',
  TopRated = 'topRatedTv',
  Trending = 'trendingTv',
}
