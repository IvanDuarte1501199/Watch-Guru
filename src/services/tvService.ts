import { TimeWindow } from '@types/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbResponse } from '@types/common/tmdbResponse';
import { MediaType } from '@types/common/MediaType';

export const getTrendingTv = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbResponse>(`/trending/tv/${time}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular tv shows:', error);
    throw error;
  }
}

export const getTvById = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/tv/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tv shows by id:', error);
    throw error;
  }
}

export const searchTv = async (query: string) => {
  try {
    const response = await tmdbApi.get<TmdbResponse>('/search/tv', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching tv shows:', error);
    throw error;
  }
}

export const getAiringToday = async () => {
  try {
    const response = await tmdbApi.get<TmdbResponse>('/tv/airing_today');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
  } catch (error) {
    console.error('Error fetching airing today tv shows:', error);
    throw error;
  }
};

export const getOnTheAir = async () => {
  try {
    const response = await tmdbApi.get<TmdbResponse>('/tv/on_the_air');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
  } catch (error) {
    console.error('Error fetching on the air tv shows:', error);
    throw error;
  }
};

export const getPopularTv = async () => {
  try {
    const response = await tmdbApi.get<TmdbResponse>('/tv/popular');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
  } catch (error) {
    console.error('Error fetching popular tv shows:', error);
    throw error;
  }
};

export const getTopRatedTv = async () => {
  try {
    const response = await tmdbApi.get<TmdbResponse>('/tv/top_rated');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
  } catch (error) {
    console.error('Error fetching top rated tv shows:', error);
    throw error;
  }
};