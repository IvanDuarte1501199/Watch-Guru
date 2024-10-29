import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';
import { TeaserResponse, TmdbMovieResponse, TmdbTvShowResponse } from '@appTypes/common/tmdbResponse';
import { MediaType } from '@appTypes/common/MediaType';
import { CreditsProps } from '@appTypes/credits/credits';
import { TeaserProps } from '@appTypes/teaser/teasers';

export const getTrendingTv = async (page: number = 1, time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TmdbMovieResponse>(
      `/trending/tv/${time}`,
      {
        params: {
          page: page
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular tv shows:', error);
    throw error;
  }
};

export const getTvById = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/tv/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tv shows by id:', error);
    throw error;
  }
};

export const searchTv = async (query: string) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>('/search/tv', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching tv shows:', error);
    throw error;
  }
};

export const getAiringToday = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>('/tv/airing_today',
      {
        params: {
          page: page
        }
      });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching airing today tv shows:', error);
    throw error;
  }
};

export const getOnTheAir = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>('/tv/on_the_air',
      {
        params: {
          page: page
        }
      });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching on the air tv shows:', error);
    throw error;
  }
};

export const getPopularTv = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>('/tv/popular',
      {
        params: {
          page: page
        }
      });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching popular tv shows:', error);
    throw error;
  }
};

export const getTopRatedTv = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>('/tv/top_rated',
      {
        params: {
          page: page
        }
      });
    const updatedResults = response.data.results.map((item) => ({
      ...item,
      media_type: MediaType.Tv,
    }));
    return {
      ...response.data,
      results: updatedResults,
    };
  } catch (error) {
    console.error('Error fetching top rated tv shows:', error);
    throw error;
  }
};

export const getRecommendatiosTvShowsById = async (tvShowId: string) => {
  try {
    const response = await tmdbApi.get<TmdbTvShowResponse>(`/tv/${tvShowId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended tv shows:', error);
    throw error;
  }
};

export const getTvShowCredits = async (tvShowId: string) => {
  try {
    const response = await tmdbApi.get<CreditsProps>(`/tv/${tvShowId}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tv show credits:', error);
    throw error;
  }
};

export const getTvShowTeasers = async (tvShowId: string) => {
  try {
    const response = await tmdbApi.get<TeaserResponse>(`/tv/${tvShowId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tv show teasers:', error);
    throw error;
  }
};
