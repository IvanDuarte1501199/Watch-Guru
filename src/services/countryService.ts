
import { Country } from '@appTypes/country/country';
import tmdbApi from './tmdbApi';

export const getCountries = async () => {
  try {
    const response = await tmdbApi.get<Country[]>('/configuration/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};
