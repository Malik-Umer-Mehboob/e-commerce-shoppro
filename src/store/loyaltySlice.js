import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const fetchLoyaltyStatus = createAsyncThunk(
  'loyalty/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/loyalty/status');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRewards = createAsyncThunk(
  'loyalty/fetchRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/loyalty/rewards');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const redeemReward = createAsyncThunk(
  'loyalty/redeemReward',
  async (rewardId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/loyalty/redeem', { reward_id: rewardId });
      toast.success('Reward redeemed successfully!');
      dispatch(fetchLoyaltyStatus());
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Redemption failed');
      return rejectWithValue(err.response.data);
    }
  }
);

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState: {
    points: 0,
    currentTier: null,
    nextTier: null,
    history: [],
    rewards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoyaltyStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload.points;
        state.currentTier = action.payload.current_tier;
        state.nextTier = action.payload.next_tier;
        state.history = action.payload.history;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.rewards = action.payload;
      });
  },
});

export default loyaltySlice.reducer;
