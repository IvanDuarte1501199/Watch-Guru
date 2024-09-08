import tmdbApi from './tmdbApi';

type TimeWindow = 'day' | 'week';

export const getPopularAll = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/all/${time}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular data:', error);
    throw error;
  }
};

export const getPopularMovies = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${time}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getPopularTv = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/tv/${time}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular tv shows:', error);
    throw error;
  }
};

export const getPopularPeople = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/person/${time}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular people:', error);
    throw error;
  }
};

export const getTvById = async (id: String) => {
  try {
    const response = await tmdbApi.get(`/tv/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching tv shows by id:', error);
    throw error;
  }
};

export const getMovieById = async (id: String) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie by id:', error);
    throw error;
  }
};

export const searchSeries = async (query: string) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching series:', error);
    throw error;
  }
};