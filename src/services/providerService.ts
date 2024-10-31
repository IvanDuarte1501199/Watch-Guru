
import { MediaType } from '@appTypes/common/MediaType';
import tmdbApi from './tmdbApi';
import { MovieAvailability } from '@appTypes/provider/provider';

type getMediaProviderProviderByCountryProps = {
  id: string;
  type: MediaType;
}
export const getMediaProvidersByCountry = async ({ id, type }: getMediaProviderProviderByCountryProps) => {
  try {
    if (!type) return;
    const response = await tmdbApi.get<MovieAvailability>(`/${type}/${id}/watch/providers`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media providers for ${type} ID: ${id}`, error);
    throw error;
  }
};
