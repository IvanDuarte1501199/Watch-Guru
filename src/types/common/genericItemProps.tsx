import { MovieProps } from '../movies/movieProps';
import { TvProps } from '../tv/tvProps';
import { TmdbGenericResponse } from './tmdbResponse';

export type GenericItemProps = TvProps | MovieProps;

export interface GenericItemsState {
  tvAndMoviesItems: GenericItemProps[];
  loading: boolean;
  error: string | null;
}

export interface GenericRandomItemState {
  randomTvOrMovie: GenericItemProps;
  loading: boolean;
  error: string | null;
}
export interface MediaSliceState {
  response: TmdbGenericResponse;
  loading: boolean;
  error: string | null;
}
