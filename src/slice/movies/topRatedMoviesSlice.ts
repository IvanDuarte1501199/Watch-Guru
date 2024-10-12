import { MoviesState } from '@appTypes/movies/movieProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedMovies } from '@services/movieService';

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
};

export const fetchTopRatedMovies = createAsyncThunk(
    'topRatedMovies/fetchTopRatedMovies',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { topRatedMovies: MoviesState };

        if (state.topRatedMovies.movies.length > 0) {
            return state.topRatedMovies.movies;
        }

        try {
            const response = await getTopRatedMovies();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching top rated movies');
        }
    }
);

const topRatedMoviesSlice = createSlice({
    name: 'topRatedMovies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default topRatedMoviesSlice.reducer;
