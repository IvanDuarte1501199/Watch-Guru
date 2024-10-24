import { useEffect, useState } from 'react';
import { getTvById } from '@services/tvService'; // Asegúrate de tener este servicio implementado

export const useTvShow = (id: string) => {
  const [tvShow, setTvShow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError('Tv Show ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const movieData = await getTvById(id);
        setTvShow(movieData);
      } catch (error) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { tvShow, loading, error };
};
