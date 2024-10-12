import { MovieProps } from '../movies/movieProps';
import { TvProps } from '../tv/tvProps';

export type GenericItemProps = TvProps | MovieProps;

export interface GenericItemsState {
    tvAndMoviesItems: GenericItemProps[];
    loading: boolean;
    error: string | null;
}
