import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPopularMovies } from '@services/movieService';

const initialState: MediaSliceState = {
  response: {
    page: 0,
    results: [],
    total_results: 0,
    total_pages: 0
  },
  loading: false,
  error: null,
};

export const fetchPopularMovies = createAsyncThunk(
  'popularMovies/fetchPopularMovies',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getPopularMovies(page);
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
        state.response = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default popularMoviesSlice.reducer;
