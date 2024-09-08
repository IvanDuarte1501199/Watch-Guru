import { TvCardProps } from '@types/tv/tvCardProps';
import React from 'react';

export function TvCard(tv: TvCardProps): JSX.Element {

  return (
    <li className='w-2/12 bg-white rounded-lg shadow-md overflow-hidden relative transform transition-transform duration-300 ease-in-out hover:scale-105 '>
      <a href={`/${tv.id}`}>
        <img src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`} title={tv.name} alt={tv.name}
          className='w-full h-full object-cover transition-all duration-300 ease-in-out filter grayscale-0 hover:grayscale' />
        <h3 className='h3-guru absolute bottom-3 px-4 text-xs text-medium-purple '>{tv.name}</h3>
        <p className='absolute p-guru text-md text-lime-zest right-4 top-4'>{tv.vote_average}</p>
      </a>
    </li>
  );
};