import { TvCardProps } from '@types/tv/tvCardProps'
import React from 'react'

export function TvCard(tv: TvCardProps): JSX.Element {
  return (
    <li className="relative w-2/12 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105">
      <a href={`/${tv.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          title={tv.name}
          alt={tv.name}
          className="h-full w-full object-cover grayscale-0 filter transition-all duration-300 ease-in-out hover:grayscale"
        />
        <h3 className="h3-guru absolute bottom-3 px-4 text-xs text-medium-purple">
          {tv.name}
        </h3>
        <p className="p-guru text-md absolute right-4 top-4 text-lime-zest">
          {tv.vote_average}
        </p>
      </a>
    </li>
  )
}
