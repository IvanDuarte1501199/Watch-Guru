import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbMovieResponse } from '@appTypes/common/tmdbResponse';
import { MediaType } from '@appTypes/common/MediaType';

export const getTrendingMovies = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>(
      `/trending/movie/${time}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getMovieById = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie by id:', error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching tv shows:', error);
    throw error;
  }
};

export const getNowPlayingMovies = async () => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>('/movie/now_playing');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>('/movie/popular');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>('/movie/top_rated');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcomingMovies = async () => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>('/movie/upcoming');
    return response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};
