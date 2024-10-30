import { useEffect, useState } from 'react';
import { getMediaProvidersByCountry } from '@services/providerService';
import { MediaType } from '@appTypes/common/MediaType';
import { CountryProviders } from '@appTypes/provider/provider';

interface UseMediaProviderParams {
  id: string;
  type: MediaType;
  country?: string;
}

const useMediaProvider = ({ id, type, country = 'US' }: UseMediaProviderParams) => {
  const [mediaProviders, setMediaProviders] = useState<CountryProviders>({} as CountryProviders);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const mediaProvidersData = await getMediaProvidersByCountry(id, type, country);
        setMediaProviders(mediaProvidersData || []);
      } catch (error) {
        setError(`Failed to fetch media providers by id: ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaProviders();
  }, [id, type, country]);

  return { mediaProviders, loading, error };
};

export default useMediaProvider;
