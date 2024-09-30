import { MovieCardProps } from '@types/movies/movieCardProps'
import React from 'react'

export function MovieCard(movie: MovieCardProps): JSX.Element {
  return (
    <li className="relative w-2/12 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105">
      <a href={`/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          title={movie.title}
          alt={movie.title}
          className="h-full w-full object-cover grayscale-0 filter transition-all duration-300 ease-in-out hover:grayscale"
        />
        <h3 className="h3-guru absolute bottom-3 px-4 text-xs text-medium-purple">
          {movie.title}
        </h3>
        <p className="p-guru text-md absolute right-4 top-4 text-lime-zest">
          {movie.vote_average}
        </p>
      </a>
    </li>
  )
}
