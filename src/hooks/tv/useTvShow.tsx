import { useEffect, useState } from 'react';
import { getTvById } from '@services/tvService'; // Asegúrate de tener este servicio implementado

export const useTvShow = (id: string) => {
  const [tvShow, setTvShow] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTvShow = async () => {
      setLoading(true);
      setError(null);
      try {
        const tvShowData = await getTvById(id);
        setTvShow(tvShowData);
      } catch (error) {
        setError('Failed to fetch TV show details');
      } finally {
        setLoading(false);
      }
    };

    fetchTvShow();
  }, [id]);

  return { tvShow, loading, error };
};
