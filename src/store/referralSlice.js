import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchReferrals = createAsyncThunk(
  'referral/fetchReferrals',
  async () => {
    const response = await api.get('/referrals');
    return response.data;
  }
);

const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default referralSlice.reducer;
