import { TvShowsState } from '@appTypes/tv/tvProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPopularTv } from '@services/tvService';

const initialState: TvShowsState = {
    tvShows: [],
    loading: false,
    error: null,
};

export const fetchPopularTv = createAsyncThunk(
    'popularTv/fetchPopularTv',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { popularTv: TvShowsState };

        if (state.popularTv.tvShows.length > 0) {
            return state.popularTv.tvShows;
        }

        try {
            const response = await getPopularTv();
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
                state.tvShows = action.payload;
            })
            .addCase(fetchPopularTv.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default popularTvSlice.reducer;
