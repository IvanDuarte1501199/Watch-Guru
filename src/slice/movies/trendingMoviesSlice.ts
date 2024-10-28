import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingMovies } from '@services/movieService';

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


export const fetchTrendingMovies = createAsyncThunk(
  'trendingMovies/fetchTrendingMovies',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getTrendingMovies(page);
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
        state.response = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingMoviesSlice.reducer;
