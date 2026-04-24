import api from './api';

export const discountService = {
  getDiscounts: () => api.get('/admin/discounts'),
  
  getDiscount: (id) => api.get(`/admin/discounts/${id}`),
  
  createDiscount: (data) => api.post('/admin/discounts', data),
  
  updateDiscount: (id, data) => api.put(`/admin/discounts/${id}`, data),
  
  deleteDiscount: (id) => api.delete(`/admin/discounts/${id}`),
};
