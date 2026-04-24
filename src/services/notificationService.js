import api from './api';

const notificationService = {
  getNotifications: (page = 1) => {
    return api.get('/user/notifications', { params: { page } });
  },

  getUnreadCount: () => {
    return api.get('/user/notifications/unread-count');
  },

  markAsRead: (id) => {
    return api.put(`/user/notifications/${id}/read`);
  },

  markAllAsRead: () => {
    return api.put('/user/notifications/read-all');
  },

  deleteNotification: (id) => {
    return api.delete(`/user/notifications/${id}`);
  },

  getPreferences: () => {
    return api.get('/user/notification-preferences');
  },

  updatePreferences: (data) => {
    return api.put('/user/notification-preferences', data);
  },
};

export default notificationService;
