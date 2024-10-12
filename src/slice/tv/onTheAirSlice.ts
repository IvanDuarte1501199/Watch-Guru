import { TvShowsState } from '@appTypes/tv/tvProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOnTheAir } from '@services/tvService';

const initialState: TvShowsState = {
    tvShows: [],
    loading: false,
    error: null,
};

export const fetchOnTheAir = createAsyncThunk(
    'onTheAir/fetchOnTheAir',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { onTheAir: TvShowsState };

        if (state.onTheAir.tvShows.length > 0) {
            return state.onTheAir.tvShows;
        }

        try {
            const response = await getOnTheAir();
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
                state.tvShows = action.payload;
            })
            .addCase(fetchOnTheAir.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default onTheAirSlice.reducer;
