import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchService from '../services/searchService';

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await searchService.search(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Search failed' });
    }
  }
);

export const getAutocomplete = createAsyncThunk(
  'search/getAutocomplete',
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchService.autocomplete(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Autocomplete failed' });
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    pagination: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
    availableFilters: { categories: [], brands: [], price_range: { min: 0, max: 10000 }, colors: [], sizes: [] },
    appliedFilters: {},
    sortBy: 'relevance',
    suggestions: { products: [], categories: [] },
    loading: false,
    suggestionsLoading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete state.appliedFilters[key];
      } else {
        state.appliedFilters[key] = value;
      }
    },
    removeFilter: (state, action) => {
      delete state.appliedFilters[action.payload];
    },
    clearAllFilters: (state) => {
      state.appliedFilters = {};
    },
    clearSuggestions: (state) => {
      state.suggestions = { products: [], categories: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.pagination = action.payload.pagination;
        state.availableFilters = action.payload.available_filters;
        state.query = action.payload.query;
        state.sortBy = action.payload.sort_by;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAutocomplete.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(getAutocomplete.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(getAutocomplete.rejected, (state) => {
        state.suggestionsLoading = false;
      });
  },
});

export const { setQuery, setSortBy, setFilter, removeFilter, clearAllFilters, clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;
