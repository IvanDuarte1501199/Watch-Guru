import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TmdbGenericResponse, TmdbMovieResponse } from '@appTypes/common/tmdbResponse';
import { MediaType } from '@appTypes/common/MediaType';

export const getTrendingMovies = async (page, time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>(
      `/trending/movie/${time}`,
      {
        params: {
          page: page
        }
      }
    );
    return response.data;
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
    const response = await tmdbApi.get<TmdbGenericResponse>('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching tv shows:', error);
    throw error;
  }
};

export const getNowPlayingMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>('/movie/now_playing',
      {
        params: {
          page: page
        }
      });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

export const getPopularMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>('/movie/popular', {
      params: {
        page: page
      }
    });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>('/movie/top_rated', {
      params: {
        page: page
      }
    });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcomingMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>('/movie/upcoming', {
      params: {
        page: page
      }
    });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Movie,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};
