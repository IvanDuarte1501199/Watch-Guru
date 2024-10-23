import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOnTheAir } from '@services/tvService';

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

export const fetchOnTheAir = createAsyncThunk(
  'onTheAir/fetchOnTheAir',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getOnTheAir(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching on the air TV shows');
    }
  }
);

const onTheAirSlice = createSlice({
  name: 'onTheAir',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnTheAir.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnTheAir.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchOnTheAir.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default onTheAirSlice.reducer;
