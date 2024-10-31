import { useEffect, useState } from 'react';
import { getMediaProvidersByCountry } from '@services/providerService';
import { MediaType } from '@appTypes/common/MediaType';
import { MovieAvailability } from '@appTypes/provider/provider';

interface UseMediaProviderParams {
  id: string;
  type: MediaType;
}

const useMediaProvider = ({ id, type }: UseMediaProviderParams) => {
  const [mediasProviders, setMediasProviders] = useState<MovieAvailability>({} as MovieAvailability);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const mediaProvidersData = await getMediaProvidersByCountry({ id, type });
        setMediasProviders(mediaProvidersData || {} as MovieAvailability);
      } catch (error) {
        setError(`Failed to fetch media providers by id: ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaProviders();
  }, [id, type]);

  return { mediasProviders, loading, error };
};

export default useMediaProvider;
