import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNowPlayingMovies } from '@services/movieService';

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

export const fetchNowPlayingMovies = createAsyncThunk(
  'nowPlayingMovies/fetchNowPlayingMovies',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await getNowPlayingMovies(page);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching now playing movies');
    }
  }
);

const nowPlayingMoviesSlice = createSlice({
  name: 'nowPlayingMovies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNowPlayingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default nowPlayingMoviesSlice.reducer;
