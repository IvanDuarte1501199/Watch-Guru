import { MediaSliceState } from "@appTypes/common/genericItemProps";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDataByKeyword } from "@services/genreService";

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


export const fetchMoviesByKeyword = createAsyncThunk(
  'moviesByKeyword/fetchMoviesByKeyword',
  async (keywordId: string, { getState, rejectWithValue }) => {
    const state = getState() as { moviesByKeywords: MediaSliceState };

    if (state.moviesByKeywords.response.results.length > 0) {
      return state.moviesByKeywords.response;
    }

    try {
      const response = await getDataByKeyword('movie', keywordId);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching movies by keyword');
    }
  }
);

const moviesByKeywordSlice = createSlice({
  name: 'moviesByKeyword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesByKeyword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchMoviesByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default moviesByKeywordSlice.reducer;
