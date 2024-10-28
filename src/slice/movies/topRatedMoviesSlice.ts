import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedMovies } from '@services/movieService';

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

export const fetchTopRatedMovies = createAsyncThunk(
  'topRatedMovies/fetchTopRatedMovies',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getTopRatedMovies(page);
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
        state.response = action.payload;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default topRatedMoviesSlice.reducer;
