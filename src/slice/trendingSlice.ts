import { GenericItemsState } from '@appTypes/common/genericItemProps';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingAll } from '@services/tmdbService';

const initialState: GenericItemsState = {
    tvAndMoviesItems: [],
    loading: false,
    error: null,
};

export const fetchTrendingAll = createAsyncThunk(
    'trendingAll/fetchTrendingAll',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { trendingAll: typeof initialState };

        if (state.trendingAll.tvAndMoviesItems.length > 0) {
            return state.trendingAll.tvAndMoviesItems;
        }

        try {
            const response = await getTrendingAll();
            return response;
        } catch (error) {
            return rejectWithValue('Error fetching trending items');
        }
    }
);

const trendingAllSlice = createSlice({
    name: 'trendingAll',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrendingAll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrendingAll.fulfilled, (state, action) => {
                state.loading = false;
                state.tvAndMoviesItems = action.payload;
            })
            .addCase(fetchTrendingAll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default trendingAllSlice.reducer;
