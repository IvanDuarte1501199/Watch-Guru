import { TmdbGenericResponse } from '@appTypes/common/tmdbResponse';
import tmdbApi from './tmdbApi';
import { MediaType } from '@appTypes/common/MediaType';

export const getMoviesGenres = async () => {
  try {
    const response = await tmdbApi.get(`/genre/movie/list`);
    return response.data.genres || [];
  } catch (error) {
    console.error('Error fetching genres: ', error);
    throw error;
  }
};

export const getTvGenres = async () => {
  try {
    const response = await tmdbApi.get(`/genre/tv/list`);
    return response.data.genres || [];
  } catch (error) {
    console.error('Error fetching genres: ', error);
    throw error;
  }
};

export const getDataByCategoryId = async (mediaType: MediaType, genreId: string, page: number = 1): Promise<TmdbGenericResponse> => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(`/discover/${mediaType}`, {
      params: {
        with_genres: genreId,
        page,
      },
    });

    const modifiedResults = response.data.results.map(item => ({
      ...item,
      media_type: mediaType,
    }));

    return { ...response.data, results: modifiedResults };
  } catch (error) {
    console.error('Error fetching data by category:', error);
    throw error;
  }
};

export const getDataByKeyword = async (mediaType: MediaType, keywordId: string, page: number = 1): Promise<TmdbGenericResponse> => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(`/discover/${mediaType}`, {
      params: {
        with_keywords: keywordId,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data by keyword:', error);
    throw error;
  }
};
