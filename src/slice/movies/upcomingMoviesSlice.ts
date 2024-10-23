import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUpcomingMovies } from '@services/movieService';

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

export const fetchUpcomingMovies = createAsyncThunk(
  'upcomingMovies/fetchUpcomingMovies',
  async (page: number, { getState, rejectWithValue }) => {
    const state = getState() as { upcomingMovies: MediaSliceState };

    if (state.upcomingMovies.response.results.length > 0) {
      return state.upcomingMovies.response;
    }

    try {
      const response = await getUpcomingMovies(page);
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
        state.response = action.payload;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default upcomingMoviesSlice.reducer;
