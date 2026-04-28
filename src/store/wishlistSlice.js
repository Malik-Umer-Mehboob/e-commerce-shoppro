import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchSharedWishlist = createAsyncThunk('wishlist/fetchSharedWishlist', async (token, { rejectWithValue }) => {
  try {
    const response = await api.get(`/wishlist/shared/${token}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/wishlist', { product_id: productId });
    toast.success('Added to wishlist!');
    dispatch(fetchWishlist());
    return response.data;
  } catch (error) {
    toast.error('Failed to add to wishlist');
    return rejectWithValue(error.response.data);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (itemId, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.delete(`/wishlist/${itemId}`);
    toast.success('Removed from wishlist');
    dispatch(fetchWishlist());
    return response.data;
  } catch (error) {
    toast.error('Failed to remove from wishlist');
    return rejectWithValue(error.response.data);
  }
});

export const updateWishlistPrivacy = createAsyncThunk('wishlist/updatePrivacy', async (privacy, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.patch('/wishlist/privacy', { privacy });
    toast.success(`Wishlist is now ${privacy}`);
    dispatch(fetchWishlist());
    return response.data;
  } catch (error) {
    toast.error('Failed to update privacy');
    return rejectWithValue(error.response.data);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: null,
    sharedWishlist: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.wishlist = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSharedWishlist.fulfilled, (state, action) => {
        state.sharedWishlist = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;

const selectWishlistState = (state) => state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlistState) => wishlistState.wishlist?.items || []
);
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.wishlist?.items.some(item => item.product_id === productId);

export default wishlistSlice.reducer;
