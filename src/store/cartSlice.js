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
      .addCase(updateCartItem.pending, (state, action) => {
        const { itemId, quantity } = action.meta.arg;
        if (state.cart && state.cart.items) {
          const item = state.cart.items.find(i => i.id === itemId);
          if (item) {
            const oldQty = item.quantity;
            const diff = quantity - oldQty;
            item.quantity = quantity;
            
            // Optimistically update summary stats
            const price = parseFloat(item.price);
            const newSubtotal = parseFloat(state.cart.subtotal) + (diff * price);
            state.cart.subtotal = newSubtotal.toFixed(2);
            
            state.cart.total_quantity = (state.cart.total_quantity || 0) + diff;
            
            const taxRate = 0.10;
            state.cart.tax_amount = (newSubtotal * taxRate).toFixed(2);
            state.cart.shipping_amount = state.cart.total_quantity > 0 ? "10.00" : "0.00";
            
            state.cart.total = (
              newSubtotal + 
              parseFloat(state.cart.tax_amount) + 
              parseFloat(state.cart.shipping_amount) - 
              parseFloat(state.cart.discount_amount || 0)
            ).toFixed(2);
          }
        }
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

const EMPTY_ARRAY = [];

export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.cart?.items || EMPTY_ARRAY;
export const selectCartTotal = (state) => state.cart.cart?.total || 0;
export const selectCartItemsCount = (state) => state.cart.cart?.total_items || 0;

export default cartSlice.reducer;
