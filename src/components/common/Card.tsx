import React, { useState } from 'react';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { MovieCard } from '@components/movies/movieCard';
import { TvCard } from '@components/tv/TvCard';
import { MovieProps } from '@appTypes/movies/movieProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { CardProps } from '@appTypes/common/CardProps';
import { Fade } from 'react-awesome-reveal';


type MediaCardProps = {
  item: GenericItemProps;
};

/* this is deprecated */
export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const isMovie = (item: GenericItemProps): item is MovieProps =>
    item.media_type === MediaType.Movie;
  const isTv = (item: GenericItemProps): item is TvProps =>
    item.media_type === MediaType.Tv;

  if (isMovie(item)) {
    return <MovieCard {...item} />;
  }

  if (isTv(item)) {
    return <TvCard {...item} />;
  }

  return null;
};

export const Card: React.FC<CardProps> = ({
  id,
  poster_path,
  vote_average,
  name,
  title,
  media_type,
}: CardProps) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const url = media_type === MediaType.Tv ? 'tv-shows' : 'movies';

  return (
    <>
      <Fade >
        <article
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`relative rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out ${isHover ? 'shadow-lg' : ''}`}
        >
          <div className="overflow-hidden h-full">
            <a href={`/${url}/${id}`}>
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                title={title || name}
                alt={title || name}
                className={`h-full w-full rounded-lg object-cover filter transition-transform duration-300 ease-in-out ${isHover ? 'scale-105' : ''}`}
              />
              <p className="p-guru absolute right-4 top-4">{vote_average}</p>
            </a>
          </div>
        </article>
      </Fade>
    </>
  );
};
