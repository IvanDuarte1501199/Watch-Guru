import { Country } from '@appTypes/country/country';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries } from '@services/countryService';

interface CountryState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  countries: [],
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk('country/fetchCountries', async () => {
  const countries = await getCountries();
  return {
    countries: countries,
  };
});

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.countries;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch countries';
      });
  },
});

export default countrySlice.reducer;
