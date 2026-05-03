import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchLanguages = createAsyncThunk(
  'localization/fetchLanguages',
  async () => {
    const response = await api.get('/localization/languages');
    return response.data;
  }
);

const localizationSlice = createSlice({
  name: 'localization',
  initialState: {
    languages: [],
    currentLanguage: localStorage.getItem('i18nextLng') || 'en',
    currentCurrency: localStorage.getItem('currency') || 'PKR',
    currencySymbol: localStorage.getItem('currencySymbol') || 'Rs.',
    exchangeRate: parseFloat(localStorage.getItem('exchangeRate')) || 1.0,
    direction: localStorage.getItem('direction') || 'ltr',
    loading: false,
    error: null,
  },
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload;
      state.currentLanguage = lang.code;
      state.currentCurrency = lang.currency_code;
      state.currencySymbol = lang.currency_symbol;
      state.exchangeRate = lang.exchange_rate;
      state.direction = lang.direction;
      
      localStorage.setItem('currency', lang.currency_code);
      localStorage.setItem('currencySymbol', lang.currency_symbol);
      localStorage.setItem('exchangeRate', lang.exchange_rate);
      localStorage.setItem('direction', lang.direction);
    },
    setCurrency: (state, action) => {
      state.currentCurrency = action.payload.code;
      state.currencySymbol = action.payload.symbol;
      state.exchangeRate = action.payload.rate;
      
      localStorage.setItem('currency', action.payload.code);
      localStorage.setItem('currencySymbol', action.payload.symbol);
      localStorage.setItem('exchangeRate', action.payload.rate);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        const data = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
        state.languages = data;
        
        // Update current settings if language found
        if (Array.isArray(data)) {
          const current = data.find(l => l.code === state.currentLanguage);
          if (current) {
            state.currentCurrency = current.currency_code;
            state.currencySymbol = current.currency_symbol;
            state.exchangeRate = current.exchange_rate;
            state.direction = current.direction;
          }
        }
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLanguage, setCurrency } = localizationSlice.actions;
export default localizationSlice.reducer;
