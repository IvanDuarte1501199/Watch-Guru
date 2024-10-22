
import { getDataByCategoryId } from '@services/genreService';
import { useEffect, useState } from 'react';

interface UseMoviesByGenreIdParams {
  genreId: string;
}

const useMoviesByGenreId = ({ genreId }: UseMoviesByGenreIdParams) => {
  const [movies, setMovies] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesByGenreId = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getDataByCategoryId('movie', genreId);
        setMovies(movieData.results);
      } catch (error) {
        setError('Failed to fetch movies by genre id: ' + genreId);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenreId();
  }, [genreId]);

  return { movies, loading, error };
};

export default useMoviesByGenreId;
