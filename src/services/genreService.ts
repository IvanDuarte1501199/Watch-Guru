import tmdbApi from './tmdbApi';

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
