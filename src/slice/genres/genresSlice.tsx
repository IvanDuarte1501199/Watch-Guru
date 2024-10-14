import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMoviesGenres, getTvGenres } from '@services/genreService';

interface GenreState {
  tvGenres: any[];
  moviesGenres: any[];
  loading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  tvGenres: [],
  moviesGenres: [],
  loading: false,
  error: null,
};

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const tvGenres = await getTvGenres();
  const moviesGenres = await getMoviesGenres();
  return {
    tvGenres: tvGenres,
    moviesGenres: moviesGenres,
  };
});

const seriesSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesGenres = action.payload.moviesGenres;
        state.tvGenres = action.payload.tvGenres;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch genres';
      });
  },
});

export default seriesSlice.reducer;
