import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbGenericResponse } from '@appTypes/common/tmdbResponse';

export const getTrendingAll = async (page: number = 1, time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(
      `/trending/all/${time}`, {
      params: {
        page,
      },
    }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRandomByType = async (type: 'movie' | 'tv') => {
  const page = Math.floor(Math.random() * 10) + 1;
  try {
    const response = await tmdbApi.get(`/discover/${type}`, {
      params: {
        page,
      },
    });
    const randomIndex = Math.floor(Math.random() * response.data.results.length);
    return response.data.results[randomIndex];
  } catch (error) {
    throw error;
  }
};
