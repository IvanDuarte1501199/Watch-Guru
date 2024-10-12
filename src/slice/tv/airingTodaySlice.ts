import { TvShowsState } from '@appTypes/tv/tvProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAiringToday } from '@services/tvService';

const initialState: TvShowsState = {
    tvShows: [],
    loading: false,
    error: null,
};

export const fetchAiringToday = createAsyncThunk(
    'airingToday/fetchAiringToday',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { airingToday: TvShowsState };

        if (state.airingToday.tvShows.length > 0) {
            return state.airingToday.tvShows;
        }

        try {
            const response = await getAiringToday();
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
                state.tvShows = action.payload;
            })
            .addCase(fetchAiringToday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default airingTodaySlice.reducer;