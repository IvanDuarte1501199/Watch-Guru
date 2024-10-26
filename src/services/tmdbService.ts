import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbGenericResponse } from '@appTypes/common/tmdbResponse';
import { getMovieById } from './movieService';
import { getTvById } from './tvService';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';

export const getTrendingAll = async (page: number = 1, time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(
      `/trending/all/${time}`, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRandomByType = async (type: MediaType) => {
  const page = Math.floor(Math.random() * 10) + 1;
  try {
    const response = await tmdbApi.get(`/discover/${type}`, {
      params: {
        page,
      },
    });
    const randomIndex = Math.floor(Math.random() * response.data.results.length);
    const randomDataId = response.data.results[randomIndex].id;
    let data: GenericItemProps;
    if (type === 'movie') {
      data = await getMovieById(randomDataId)
    } else if (type) {
      data = await getTvById(randomDataId)
    } else {
      throw new Error('Invalid type');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
