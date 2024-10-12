import { MovieProps } from './movieProps';

export type MovieCardProps = Pick<
  MovieProps,
  'title' | 'poster_path' | 'id' | 'vote_average'
>;
