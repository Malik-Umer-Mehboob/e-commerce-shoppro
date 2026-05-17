import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../services/notificationService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch' });
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUnreadCount();
      return response.data.unread_count;
    } catch (error) {
      return rejectWithValue(0);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      if (notificationService.deleteNotification) {
        await notificationService.deleteNotification(id);
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getPreferences();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (data, { rejectWithValue }) => {
    try {
      const response = await notificationService.updatePreferences(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    pagination: { current_page: 1, last_page: 1, total: 0 },
    preferences: {
      email_preferences: {},
      mobile_number: '',
    },
    loading: false,
    preferencesLoading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          total: action.payload.total,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.items.find((n) => n.id === id);
        if (item && !item.read_at) {
          item.read_at = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => { n.read_at = n.read_at || new Date().toISOString(); });
        state.unreadCount = 0;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })

      .addCase(fetchPreferences.pending, (state) => { state.preferencesLoading = true; })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state) => { state.preferencesLoading = false; })

      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = {
          email_preferences: action.payload.email_preferences,
          mobile_number: action.payload.mobile_number,
        };
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
