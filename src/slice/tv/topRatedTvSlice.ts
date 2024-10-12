import { TvShowsState } from '@appTypes/tv/tvProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTopRatedTv } from '@services/tvService';

const initialState: TvShowsState = {
    tvShows: [],
    loading: false,
    error: null,
};

export const fetchTopRatedTv = createAsyncThunk(
    'topRatedTv/fetchTopRatedTv',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { topRatedTv: TvShowsState };

        if (state.topRatedTv.tvShows.length > 0) {
            return state.topRatedTv.tvShows;
        }

        try {
            const response = await getTopRatedTv();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching top rated TV shows');
        }
    }
);

const topRatedTvSlice = createSlice({
    name: 'topRatedTv',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRatedTv.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedTv.fulfilled, (state, action) => {
                state.loading = false;
                state.tvShows = action.payload;
            })
            .addCase(fetchTopRatedTv.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default topRatedTvSlice.reducer;