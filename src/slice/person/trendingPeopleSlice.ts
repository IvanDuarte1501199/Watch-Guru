import { PersonProps } from '@appTypes/person/personProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingPeople } from '@services/personService';

interface PeopleState {
  people: PersonProps[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  people: [],
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
        state.people = action.payload;
      })
      .addCase(fetchTrendingPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default trendingPeopleSlice.reducer;
