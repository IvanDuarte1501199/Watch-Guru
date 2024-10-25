import { useEffect, useState } from 'react';
import { getRecommendatiosTvShowsById, getTvById } from '@services/tvService';
import { GenericItemProps } from '@appTypes/common/genericItemProps';

export const useTvShow = (id: string, getRecommendedTvShows: boolean = false) => {
  const [tvShow, setTvShow] = useState<any | null>(null);
  const [recommendedTvShows, setRecommendedTvShows] = useState<GenericItemProps[]>([]);
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
        const tvShowData = await getTvById(id);
        if (getRecommendedTvShows && tvShowData) {
          const similarMovies = await getRecommendatiosTvShowsById(id);
          setRecommendedTvShows(similarMovies.results);
        }
        setTvShow(tvShowData);
      } catch (error) {
        setError('Failed to fetch tv shows details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { tvShow, recommendedTvShows, loading, error };
};
