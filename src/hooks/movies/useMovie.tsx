import { useEffect, useState } from 'react';
import { getMovieById, getRecommendatiosMoviesById } from '@services/movieService';
import { MovieProps } from '@appTypes/movies/movieProps';
import { GenericItemProps } from '@appTypes/common/genericItemProps';

export const useMovie = (id: string, getRecommendedMovies: boolean = false) => {
  const [movie, setMovie] = useState<MovieProps>({} as MovieProps);
  const [recommendedMovies, setRecommendedMovies] = useState<GenericItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError('Movie ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieById(id);
        if (getRecommendedMovies && movieData) {
          const similarMovies = await getRecommendatiosMoviesById(id);
          setRecommendedMovies(similarMovies.results);
        }
        setMovie(movieData);
      } catch (error) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { movie, recommendedMovies, loading, error };
};
