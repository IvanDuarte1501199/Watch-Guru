import React from 'react';
import { MovieProps } from "@appTypes/movies/movieProps";
import GenresList from '@components/genres/GenreList';

interface MovieDetailsProps {
  movie: MovieProps;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => (
  <div className="mt-6 md:mt-0 animate-fade-in-left">
    <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>
    {movie?.tagline && (
      <p className="italic text-lg text-gray-300 mb-4">"{movie.tagline}"</p>
    )}
    <p className="text-lg mb-4">{movie?.overview}</p>
    {movie?.genres && <GenresList genres={movie.genres} />}
  </div>
);

export default MovieDetails;
