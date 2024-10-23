
import { MediaType } from '@appTypes/common/MediaType';
import { getDataByCategoryId } from '@services/genreService';
import { useEffect, useState } from 'react';

interface UseMediaByGenreIdParams {
  genreId: string;
  mediaType?: MediaType
}

const useMediaByGenreId = ({ genreId, mediaType = MediaType.Movie }: UseMediaByGenreIdParams) => {
  const [media, setMedia] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesByGenreId = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getDataByCategoryId(mediaType, genreId);
        setMedia(movieData.results);
      } catch (error) {
        setError(`Failed to fetch ${mediaType} by genre id: ${genreId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenreId();
  }, [genreId]);

  return { media, loading, error };
};

export default useMediaByGenreId;
