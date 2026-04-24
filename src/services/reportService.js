import api from './api';

const reportService = {
  // Admin Reports
  getSales: (days = 30) => api.get(`/admin/reports/sales?days=${days}`),
  getInventory: () => api.get('/admin/reports/inventory'),
  getCustomers: (days = 30) => api.get(`/admin/reports/customers?days=${days}`),
  getTaxes: (days = 30) => api.get(`/admin/reports/taxes?days=${days}`),
  getShipping: (days = 30) => api.get(`/admin/reports/shipping?days=${days}`),
  getRefunds: (days = 30) => api.get(`/admin/reports/refunds?days=${days}`),
  getCoupons: (days = 30) => api.get(`/admin/reports/coupons?days=${days}`),

  // Seller Reports
  getSellerSales: (days = 30) => api.get(`/seller/reports/sales?days=${days}`),

  // Export
  exportReport: async (type, days = 30) => {
    const response = await api.get(`/admin/reports/export?type=${type}&days=${days}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Invoice
  downloadInvoice: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/invoice/download`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default reportService;
