import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbGenericResponse } from '@appTypes/common/tmdbResponse';

export const getTrendingAll = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(
      `/trending/all/${time}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular data:', error);
    throw error;
  }
};
