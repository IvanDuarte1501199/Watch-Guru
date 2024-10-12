import { TvShowsState } from '@appTypes/tv/tvProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingTv } from '@services/tvService';

const initialState: TvShowsState = {
  tvShows: [],
  loading: false,
  error: null,
};

export const fetchTrendingTv = createAsyncThunk(
  'trendingTv/fetchTrendingTv',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { trendingTv: TvShowsState };

    if (state.trendingTv.tvShows.length > 0) {
      return state.trendingTv.tvShows;
    }

    try {
      const response = await getTrendingTv();
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching trending TV shows');
    }
  }
);

const trendingTvSlice = createSlice({
  name: 'trendingTv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingTv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingTv.fulfilled, (state, action) => {
        state.loading = false;
        state.tvShows = action.payload;
      })
      .addCase(fetchTrendingTv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingTvSlice.reducer;
