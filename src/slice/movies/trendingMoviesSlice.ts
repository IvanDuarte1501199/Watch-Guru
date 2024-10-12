import { MoviesState } from '@appTypes/movies/movieProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingMovies } from '@services/movieService';

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
};

export const fetchTrendingMovies = createAsyncThunk(
    'trendingMovies/fetchTrendingMovies',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { trendingMovies: MoviesState };

        if (state.trendingMovies.movies.length > 0) {
            return state.trendingMovies.movies;
        }

        try {
            const response = await getTrendingMovies();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching trending movies');
        }
    }
);

const trendingMoviesSlice = createSlice({
    name: 'trendingMovies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrendingMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchTrendingMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default trendingMoviesSlice.reducer;
