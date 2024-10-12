import { MoviesState } from '@appTypes/movies/movieProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPopularMovies } from '@services/movieService';

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchPopularMovies = createAsyncThunk(
  'popularMovies/fetchPopularMovies',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { popularMovies: MoviesState };

    if (state.popularMovies.movies.length > 0) {
      return state.popularMovies.movies;
    }

    try {
      const response = await getPopularMovies();
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching popular movies');
    }
  }
);

const popularMoviesSlice = createSlice({
  name: 'popularMovies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default popularMoviesSlice.reducer;
