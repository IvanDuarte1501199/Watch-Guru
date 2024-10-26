import { useEffect, useState } from 'react';
import { getRecommendatiosTvShowsById, getTvById, getTvShowCredits } from '@services/tvService';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { CreditsProps } from '@appTypes/credits/credits';

export const useTvShow = (id: string, getRecommendedTvShows: boolean = false, getCredits: boolean = false) => {
  const [tvShow, setTvShow] = useState<any | null>(null);
  const [recommendedTvShows, setRecommendedTvShows] = useState<GenericItemProps[]>([]);
  const [tvShowCredits, setTvShowCredits] = useState<CreditsProps>({} as CreditsProps);
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
        if (getCredits && tvShowData) {
          const tvShowCredits = await getTvShowCredits(id);
          setTvShowCredits(tvShowCredits);
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

  return { tvShow, recommendedTvShows, tvShowCredits, loading, error };
};
