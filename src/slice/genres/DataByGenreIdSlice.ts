import { MediaSliceState } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { Genre } from '@appTypes/genres/genre';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataByCategoryId } from '@services/genreService';

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

export const fetchMediaByCategoryId = createAsyncThunk(
  'media/getMediaByCategoryId',
  async ({ categoryId, page }: { categoryId: string, page: number }, { getState }) => {
    const { genres } = getState() as { genres: { moviesGenres: Genre[], tvGenres: Genre[] } };
    const movieGenreObj = genres.moviesGenres.find((g) => g.id == categoryId);
    const tvShowGenreObj = genres.tvGenres.find((g) => g.id == categoryId);
    const mediaType = movieGenreObj ? MediaType.Movie : MediaType.Tv;
    if (!movieGenreObj && !tvShowGenreObj) {
      throw new Error(`Genre with id "${categoryId}" not found`);
    }
    const response = await getDataByCategoryId(mediaType, categoryId, page);
    return response;
  }
);

const dataByCategoryId = createSlice({
  name: 'dataByCategoryId',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaByCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaByCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(fetchMediaByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default dataByCategoryId.reducer;
