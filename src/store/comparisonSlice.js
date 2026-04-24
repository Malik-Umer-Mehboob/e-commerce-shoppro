import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const fetchComparison = createAsyncThunk(
  'comparison/fetchComparison',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/comparison');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addToComparison = createAsyncThunk(
  'comparison/addToComparison',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post('/comparison', { product_id: productId });
      toast.success('Added to comparison!');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to comparison');
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeFromComparison = createAsyncThunk(
  'comparison/removeFromComparison',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/comparison/${productId}`);
      toast.success('Removed from comparison');
      return productId;
    } catch (err) {
      toast.error('Failed to remove from comparison');
      return rejectWithValue(err.response.data);
    }
  }
);

export const clearComparison = createAsyncThunk(
  'comparison/clearComparison',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/comparison/clear');
      toast.success('Comparison list cleared');
      return null;
    } catch (err) {
      toast.error('Failed to clear comparison');
      return rejectWithValue(err.response.data);
    }
  }
);

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComparison.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
      })
      .addCase(fetchComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToComparison.fulfilled, (state, action) => {
        state.items = action.payload.products || [];
      })
      .addCase(removeFromComparison.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(clearComparison.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default comparisonSlice.reducer;
