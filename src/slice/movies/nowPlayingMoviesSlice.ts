import { MoviesState } from '@appTypes/movies/movieProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNowPlayingMovies } from '@services/movieService';

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
};

export const fetchNowPlayingMovies = createAsyncThunk(
    'nowPlayingMovies/fetchNowPlayingMovies',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { nowPlayingMovies: MoviesState };

        if (state.nowPlayingMovies.movies.length > 0) {
            return state.nowPlayingMovies.movies;
        }

        try {
            const response = await getNowPlayingMovies();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching now playing movies');
        }
    }
);

const nowPlayingMoviesSlice = createSlice({
    name: 'nowPlayingMovies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNowPlayingMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default nowPlayingMoviesSlice.reducer;
