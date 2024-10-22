import { GenericItemProps, GenericRandomItemState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRandomByType } from '@services/tmdbService';

const initialState: GenericRandomItemState = {
  randomTvOrMovie: {} as GenericItemProps,
  loading: false,
  error: null,
};

export const fetchRandomByType = createAsyncThunk(
  'random/fetchRandomByType',
  async (type: 'movie' | 'tv', { rejectWithValue }) => {
    try {
      const randomItem = await getRandomByType(type);
      return randomItem;
    } catch (error) {
      return rejectWithValue('Error fetching random movie or TV show');
    }
  }
);

const randomMovieOrTvSlice = createSlice({
  name: 'randomMovieOrTv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomByType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.randomTvOrMovie = {} as GenericItemProps;
      })
      .addCase(fetchRandomByType.fulfilled, (state, action) => {
        state.loading = false;
        state.randomTvOrMovie = action.payload;
      })
      .addCase(fetchRandomByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default randomMovieOrTvSlice.reducer;
