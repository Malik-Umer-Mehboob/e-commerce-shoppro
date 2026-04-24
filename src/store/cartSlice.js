import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Helper to get or create session ID without external dependencies
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    // Simple random string generator
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await api.get('/cart', {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await api.post('/cart', { ...payload, session_id: sessionId }, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await api.put(`/cart/${itemId}`, { quantity, session_id: sessionId }, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (itemId, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${itemId}`, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await api.post('/cart/coupon', { code, session_id: sessionId }, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('cart/'),
        (state, action) => {
          if (action.payload.cart) {
            state.cart = action.payload.cart;
          }
        }
      );
  },
});

export const { clearCartState } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.cart?.items || [];
export const selectCartTotal = (state) => state.cart.cart?.total || 0;
export const selectCartItemsCount = (state) => state.cart.cart?.total_items || 0;

export default cartSlice.reducer;
