import React from 'react';
import { GenericItemProps } from '@types/common/genericItemProps'
import { MediaType } from '@types/common/MediaType';
import { MovieCard } from '@components/movies/movieCard';
import { TvCard } from '@components/tv/TvCard';
import { MovieProps } from '@types/movies/movieProps';
import { TvProps } from '@types/tv/tvProps';

type MediaCardProps = {
    item: GenericItemProps;
};

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
    const isMovie = (item: GenericItemProps): item is MovieProps => item.media_type === MediaType.Movie;
    const isTv = (item: GenericItemProps): item is TvProps => item.media_type === MediaType.Tv;

    if (isMovie(item)) {
        return <MovieCard {...item} />;
    }

    if (isTv(item)) {
        return <TvCard {...item} />;
    }

    return null;
};