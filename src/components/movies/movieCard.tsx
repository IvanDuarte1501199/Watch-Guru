import { MovieCardProps } from '@appTypes/movies/movieCardProps';
import React, { useState } from 'react';

export function MovieCard(movie: MovieCardProps): JSX.Element {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative shadow-sm transform overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out ${isHover ? 'scale-105' : ''}`}
    >
      <a href={`/movies/${movie.id}`}>
        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          title={movie.title}
          alt={movie.title}
          className={`h-full w-full object-cover filter transition-all duration-300 ease-in-out ${isHover ? 'grayscale' : 'grayscale-0'}`}
        />
        <p className="p-guru absolute right-4 top-4">{movie.vote_average}</p>
      </a>
    </article>
  );
}
