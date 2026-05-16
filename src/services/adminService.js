import api from './api';

const adminService = {
  /**
   * Get dashboard statistics and recent activity
   */
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  /**
   * Get daily sales chart data (revenue + order count)
   * @param {number} days - number of days to look back (7–90, default 30)
   */
  getSalesChartData: (days = 30) => api.get('/admin/dashboard/sales-chart', { params: { days } }),
};

export default adminService;
