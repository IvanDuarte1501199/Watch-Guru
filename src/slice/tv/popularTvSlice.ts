import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPopularTv } from '@services/tvService';

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

export const fetchPopularTv = createAsyncThunk(
  'popularTv/fetchPopularTv',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getPopularTv(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching popular TV shows');
    }
  }
);

const popularTvSlice = createSlice({
  name: 'popularTv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularTv.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularTv.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchPopularTv.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default popularTvSlice.reducer;
