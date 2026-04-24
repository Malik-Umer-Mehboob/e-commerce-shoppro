import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const fetchMyGiftCards = createAsyncThunk(
  'giftCards/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/gift-cards');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const buyGiftCard = createAsyncThunk(
  'giftCards/buy',
  async (cardData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/gift-cards', cardData);
      toast.success('Gift card purchased successfully!');
      dispatch(fetchMyGiftCards());
      return response.data;
    } catch (err) {
      toast.error('Failed to purchase gift card');
      return rejectWithValue(err.response.data);
    }
  }
);

const giftCardSlice = createSlice({
  name: 'giftCards',
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGiftCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyGiftCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      });
  },
});

export default giftCardSlice.reducer;
