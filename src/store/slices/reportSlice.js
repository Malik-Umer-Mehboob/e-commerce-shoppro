import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../../services/reportService';

export const fetchAdminSales = createAsyncThunk('reports/fetchSales', async (days, thunkAPI) => {
  try {
    const response = await reportService.getSales(days);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchAdminInventory = createAsyncThunk('reports/fetchInventory', async (_, thunkAPI) => {
  try {
    const response = await reportService.getInventory();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  salesData: null,
  inventoryData: null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSales.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })
      .addCase(fetchAdminSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryData = action.payload;
      })
      .addCase(fetchAdminInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
