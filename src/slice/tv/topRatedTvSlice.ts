import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedTv } from '@services/tvService';

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

export const fetchTopRatedTv = createAsyncThunk(
  'topRatedTv/fetchTopRatedTv',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getTopRatedTv(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching top rated TV shows');
    }
  }
);

const topRatedTvSlice = createSlice({
  name: 'topRatedTv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopRatedTv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRatedTv.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchTopRatedTv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default topRatedTvSlice.reducer;
