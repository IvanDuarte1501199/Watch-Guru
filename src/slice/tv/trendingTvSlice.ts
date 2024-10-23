import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingTv } from '@services/tvService';

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

export const fetchTrendingTv = createAsyncThunk(
  'trendingTv/fetchTrendingTv',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getTrendingTv(page);
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
        state.response = action.payload;
      })
      .addCase(fetchTrendingTv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingTvSlice.reducer;
