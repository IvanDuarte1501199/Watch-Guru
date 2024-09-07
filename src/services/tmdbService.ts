import tmdbApi from './tmdbApi';

export const getPopularShows = async () => {
  try {
    const response = await tmdbApi.get('/movie/now_playing');
    console.log('response.data.results', JSON.stringify(response.data.results))
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular series:', error);
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