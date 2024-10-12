import { MoviesState } from '@appTypes/movies/movieProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUpcomingMovies } from '@services/movieService';

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
};

export const fetchUpcomingMovies = createAsyncThunk(
    'upcomingMovies/fetchUpcomingMovies',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { upcomingMovies: MoviesState };

        if (state.upcomingMovies.movies.length > 0) {
            return state.upcomingMovies.movies;
        }

        try {
            const response = await getUpcomingMovies();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching upcoming movies');
        }
    }
);

const upcomingMoviesSlice = createSlice({
    name: 'upcomingMovies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUpcomingMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchUpcomingMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default upcomingMoviesSlice.reducer;
