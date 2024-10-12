import { TvProps } from './tvProps';

export type TvCardProps = Pick<
    TvProps,
    'name' | 'poster_path' | 'vote_average' | 'id'
>;
