import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingAll } from '@services/tmdbService';

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

export const fetchTrendingAll = createAsyncThunk(
  'trendingAll/fetchTrendingAll',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getTrendingAll(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching trending Movies andTV shows');
    }
  }
);

const trendingAllSlice = createSlice({
  name: 'trendingTv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingAll.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchTrendingAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingAllSlice.reducer;

