import { useEffect, useState } from 'react';
import { getRecommendatiosMoviesById } from '@services/movieService';
import { MediaType } from '@appTypes/common/MediaType';
import { getRandomByType } from '@services/tmdbService';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { getRecommendatiosTvShowsById } from '@services/tvService';

export const useRandomMovieOrTv = (type: MediaType) => {
  const [randomItem, setRandomItem] = useState<GenericItemProps | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<GenericItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const item = await getRandomByType(type);
        setRandomItem(item);

        if (item?.id) {
          let similars: GenericItemProps[] = [];
          if (type === MediaType.Movie) {
            const similarMovies = await getRecommendatiosMoviesById(item.id);
            similars = similarMovies.results;
          } else if (type === MediaType.Tv) {
            const similarTvShows = await getRecommendatiosTvShowsById(item.id);
            similars = similarTvShows.results;
          }
          setRecommendedItems(similars);
        }
      } catch (err) {
        setError('Failed to fetch random item or recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomItem();
  }, [type]);

  return {
    randomItem,
    recommendedItems,
    loading,
    error,
  };
};
