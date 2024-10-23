import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAiringToday } from '@services/tvService';

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

export const fetchAiringToday = createAsyncThunk(
  'airingToday/fetchAiringToday',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getAiringToday(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching airing today TV shows');
    }
  }
);

const airingTodaySlice = createSlice({
  name: 'airingToday',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiringToday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiringToday.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchAiringToday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default airingTodaySlice.reducer;
