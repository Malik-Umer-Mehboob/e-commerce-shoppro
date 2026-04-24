import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchAffiliateDashboard = createAsyncThunk(
  'affiliate/fetchDashboard',
  async () => {
    const response = await api.get('/affiliate/dashboard');
    return response.data;
  }
);

export const registerAffiliate = createAsyncThunk(
  'affiliate/register',
  async (payoutDetails) => {
    const response = await api.post('/affiliate/register', { payout_details: payoutDetails });
    return response.data;
  }
);

const affiliateSlice = createSlice({
  name: 'affiliate',
  initialState: {
    dashboard: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAffiliateDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAffiliateDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAffiliateDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default affiliateSlice.reducer;
