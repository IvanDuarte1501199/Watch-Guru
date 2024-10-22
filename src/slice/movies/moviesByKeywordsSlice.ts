import { MovieProps, MoviesState } from "@appTypes/movies/movieProps";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDataByKeyword } from "@services/genreService";

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchMoviesByKeyword = createAsyncThunk(
  'moviesByKeyword/fetchMoviesByKeyword',
  async (keywordId: string, { getState, rejectWithValue }) => {
    const state = getState() as { moviesByKeywords: MoviesState };

    if (state.moviesByKeywords.movies.length > 0) {
      return state.moviesByKeywords.movies;
    }

    try {
      console.log
      const response = await getDataByKeyword('movie', keywordId);
      const { results } = response;
      return results;
    } catch (error) {
      return rejectWithValue('Error fetching movies by keyword');
    }
  }
);

const moviesByKeywordSlice = createSlice({
  name: 'moviesByKeyword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesByKeyword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload as MovieProps[];
      })
      .addCase(fetchMoviesByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default moviesByKeywordSlice.reducer;
