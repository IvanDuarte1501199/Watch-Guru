import { MovieCardProps } from '@types/movies/movieCardProps';
import React from 'react';

export function MovieCard(movie: MovieCardProps): JSX.Element {

    return (
        <li className='w-2/12 bg-white rounded-lg shadow-md overflow-hidden relative transform transition-transform duration-300 ease-in-out hover:scale-105'>
            <a href={`/${movie.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} title={movie.title} alt={movie.title}
                    className='w-full h-full object-cover transition-all duration-300 ease-in-out filter grayscale-0 hover:grayscale' />
                <h3 className='h3-guru absolute bottom-3 px-4 text-xs text-medium-purple'>{movie.title}</h3>
                <p className='absolute p-guru text-md text-lime-zest right-4 top-4 '>{movie.vote_average}</p>
            </a>
        </li>
    );
};