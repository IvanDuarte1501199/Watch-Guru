import { useEffect, useState } from 'react';
import { getMovieCredits, getRecommendatiosMoviesById } from '@services/movieService';
import { MediaType } from '@appTypes/common/MediaType';
import { getRandomByType } from '@services/tmdbService';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { getRecommendatiosTvShowsById, getTvShowCredits } from '@services/tvService';
import { CreditsProps } from '@appTypes/credits/credits';

export const useRandomMovieOrTv = (type: MediaType, getRecommended: boolean = true, getCredits: boolean = false) => {
  const [randomItem, setRandomItem] = useState<GenericItemProps | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<GenericItemProps[]>([]);
  const [itemsCredits, setItemsCredits] = useState<CreditsProps>({} as CreditsProps);
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
          if (getRecommended) {
            if (type === MediaType.Movie) {
              const similarMovies = await getRecommendatiosMoviesById(item.id);
              similars = similarMovies.results;
            } else if (type === MediaType.Tv) {
              const similarTvShows = await getRecommendatiosTvShowsById(item.id);
              similars = similarTvShows.results;
            }
          }
          if (getCredits && item) {
            if (type === MediaType.Movie) {
              const itemCredits = await getMovieCredits(item.id);
              setItemsCredits(itemCredits);
            }
            if (type === MediaType.Tv) {
              const itemCredits = await getTvShowCredits(item.id);
              setItemsCredits(itemCredits);
            }
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
    itemsCredits,
    loading,
    error,
  };
};
