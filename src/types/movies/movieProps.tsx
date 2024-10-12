import { MediaType } from '../common/MediaType'

export interface MovieProps {
  backdrop_path: string
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  media_type: MediaType
  adult: boolean
  original_language: string
  genre_ids: number[]
  popularity: number
  release_date: Date
  video: boolean
  vote_average: number
  vote_count: number
}


export interface MoviesState {
  movies: MovieProps[];
  loading: boolean;
  error: string | null;
}

export enum MovieType {
  Popular = 'popular',
  NowPlaying = 'nowPlaying',
  TopRated = 'topRated',
  Upcoming = 'upcoming',
  Trending = 'trending',
}