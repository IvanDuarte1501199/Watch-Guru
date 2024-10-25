import { PeopleSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingPeople } from '@services/personService';

const initialState: PeopleSliceState = {
  response: {
    page: 0,
    results: [],
    total_results: 0,
    total_pages: 0
  },
  loading: false,
  error: null,
};

export const fetchTrendingPeople = createAsyncThunk(
  'trendingPeople/fetchTrendingPeople',
  async () => {
    const people = await getTrendingPeople();
    return people;
  }
);

const trendingPeopleSlice = createSlice({
  name: 'trendingPeople',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchTrendingPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingPeopleSlice.reducer;
