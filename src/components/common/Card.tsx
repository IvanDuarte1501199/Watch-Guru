import React, { useState } from 'react';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { MovieCard } from '@components/movies/movieCard';
import { TvCard } from '@components/tv/TvCard';
import { MovieProps } from '@appTypes/movies/movieProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { CardProps } from '@appTypes/common/CardProps';
import { Fade } from 'react-awesome-reveal';
import CircularVote from '@components/CircularVote';

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

  const url = media_type === MediaType.Tv ? 'tv-show' : 'movie';

  return (
    <Fade triggerOnce>
      <article
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-80 flex justify-center h-full rounded-md bg-transparent shadow-md overflow-hidden"
      >
        <div
          className={`relative overflow-visible transition-transform duration-300 ease-in-out ${isHover ? 'scale-105' : ''}`}
        >
          <a href={`/${url}/${id}`} className="block h-full w-full">
            {poster_path ? (
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                title={title || name}
                alt={title || name}
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div
                className={`flex h-full w-screen items-center justify-center rounded-md transition-colors duration-300 ease-in-out ${isHover
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-500'
                  } text-white text-center p-4`}
                title={title || name}
              >
                <h2 className="text-lg max-w-56 font-bold">{title || name}</h2>
              </div>
            )}
          </a>
        </div>
        <span className="absolute right-0.5 top-0.5">
          <CircularVote voteAverage={vote_average} />
        </span>
      </article>
    </Fade>
  );
};
