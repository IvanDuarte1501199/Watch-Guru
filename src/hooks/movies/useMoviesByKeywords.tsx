
import { getDataByKeyword } from '@services/genreService';
import { useEffect, useState } from 'react';

interface UseMoviesByKeywordsParams {
  keywords: string;
}

const useMoviesByKeywords = ({ keywords }: UseMoviesByKeywordsParams) => {
  const [movies, setMovies] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesByKeywords = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getDataByKeyword('movie', keywords);
        setMovies(movieData.results);
      } catch (error) {
        setError('Failed to fetch movies by keywords id: ' + keywords);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByKeywords();
  }, [keywords]);

  return { movies, loading, error };
};

export default useMoviesByKeywords;
