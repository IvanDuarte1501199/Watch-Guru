import { PersonProps } from '@appTypes/person/personProps';
import { MovieProps } from '../movies/movieProps';
import { TvProps } from '../tv/tvProps';
import { TmdbGenericResponse, PeoplePropsResponse } from './tmdbResponse';

export type GenericItemProps = TvProps | MovieProps;
export type MultiGenericItemProps = TvProps | MovieProps | PersonProps;

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

export interface PeopleSliceState {
  response: PeoplePropsResponse;
  loading: boolean;
  error: string | null;
}
