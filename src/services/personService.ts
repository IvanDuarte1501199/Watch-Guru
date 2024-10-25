import { TimeWindow } from '@appTypes/service/imdb';
import tmdbApi from './tmdbApi';

export const getTrendingPeople = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/person/${time}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular people:', error);
    throw error;
  }
};

export const getPersonById = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/person/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching person by id:', error);
    throw error;
  }
};

export const getPersonMoviesCredits = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/person/${id}/movie_credits`);
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching person movie credits:', error);
    throw error;
  }
};

export const getPersonTvCredits = async (id: string) => {
  try {
    const response = await tmdbApi.get(`/person/${id}/tv_credits`);
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching person tv credits:', error);
    throw error;
  }
};

export const getPersonCombinedCredits = async (id: string) => {
  try {
    const movieCredits = await getPersonMoviesCredits(id);
    const tvCredits = await getPersonTvCredits(id);
    return {
      movies: movieCredits,
      tv: tvCredits,
    };
  } catch (error) {
    console.error('Error fetching person combined credits:', error);
    throw error;
  }
};
