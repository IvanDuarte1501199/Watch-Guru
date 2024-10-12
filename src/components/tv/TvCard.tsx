import { TvCardProps } from '@appTypes/tv/tvCardProps'
import React, { useState } from 'react'

export function TvCard(tv: TvCardProps): JSX.Element {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transform overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out ${isHover ? 'scale-105' : ''}`}>
      <a href={`/tv-shows/${tv.id}`}>
        <img
          loading='lazy'
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          title={tv.name}
          alt={tv.name}
          className={`h-full w-full object-cover filter transition-all duration-300 ease-in-out ${isHover ? 'grayscale' : 'grayscale-0'}`}
        />
        <p className="p-guru absolute right-4 top-4">
          {tv.vote_average}
        </p>
      </a>
    </li>
  )
}
