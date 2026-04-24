import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (params) => {
    const response = await api.get('/blog/posts', { params });
    return response.data;
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async (slug) => {
    const response = await api.get(`/blog/posts/${slug}`);
    return response.data;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    posts: [],
    currentPost: null,
    relatedPosts: [],
    sidebar: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          total: action.payload.total,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.post;
        state.relatedPosts = action.payload.related;
        state.sidebar = action.payload.sidebar;
      });
  },
});

export default blogSlice.reducer;
