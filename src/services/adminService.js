import api from './api';

const adminService = {
  /**
   * Get dashboard statistics and recent activity
   */
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

export default adminService;
