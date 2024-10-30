
import { MediaType } from '@appTypes/common/MediaType';
import tmdbApi from './tmdbApi';

export const getMediaProvidersByCountry = async (id: string, type: MediaType, country: string = 'US') => {
  try {
    if (!type) return;
    const response = await tmdbApi.get(`/${type}/${id}/watch/providers`, {
      params: { region: country }
    });
    return response.data.results?.[country] || null;
  } catch (error) {
    console.error(`Error fetching media providers for ${type} ID: ${id} region: ${country}`, error);
    throw error;
  }

};
