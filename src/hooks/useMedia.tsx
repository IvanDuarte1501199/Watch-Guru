import { useEffect, useState } from 'react';
import { getMovieById, getMovieCredits, getMovieTeasers, getRecommendatiosMoviesById } from '@services/movieService';
import { getTvById, getTvShowCredits, getRecommendatiosTvShowsById, getTvShowTeasers } from '@services/tvService';
import { getRandomByType } from '@services/tmdbService';
import { MovieProps } from '@appTypes/movies/movieProps';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { CreditsProps } from '@appTypes/credits/credits';
import { MediaType } from '@appTypes/common/MediaType';
import { TeaserProps } from '@appTypes/teaser/teasers';

interface UseMediaOptions {
  type: MediaType;
  id?: string;
  getRecommended?: boolean;
  getCredits?: boolean;
  getTeasers?: boolean;
}

export const useMedia = ({ type, id, getRecommended = false, getCredits = false, getTeasers = false }: UseMediaOptions) => {
  const [media, setMedia] = useState<GenericItemProps>({} as GenericItemProps);
  const [recommendedItems, setRecommendedItems] = useState<GenericItemProps[]>([]);
  const [mediaCredits, setMediaCredits] = useState<CreditsProps>({} as CreditsProps);
  const [mediaTeasers, setMediaTeasers] = useState<TeaserProps[]>([] as TeaserProps[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        let mediaData: MovieProps | GenericItemProps = {} as GenericItemProps;

        if (id) {
          mediaData = type === MediaType.Movie ? await getMovieById(id) : await getTvById(id);
        } else {
          mediaData = await getRandomByType(type);
        }

        setMedia(mediaData);

        if (mediaData?.id) {
          if (getRecommended) {
            const recommendations = type === MediaType.Movie
              ? await getRecommendatiosMoviesById(mediaData.id)
              : await getRecommendatiosTvShowsById(mediaData.id);
            setRecommendedItems(recommendations.results);
          }
          if (getCredits) {
            const credits = type === MediaType.Movie
              ? await getMovieCredits(mediaData.id)
              : await getTvShowCredits(mediaData.id);
            setMediaCredits(credits);
          }
          if (getTeasers) {
            const teasers = type === MediaType.Movie
              ? await getMovieTeasers(mediaData.id)
              : await getTvShowTeasers(mediaData.id);
            setMediaTeasers(teasers.results);
          }
        }
      } catch (err) {
        setError('Failed to fetch media details');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [type, id, getRecommended, getCredits]);

  return { media, recommendedItems, mediaCredits, mediaTeasers, loading, error };
};
