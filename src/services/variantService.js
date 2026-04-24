import api from './api';

export const variantService = {
  getVariants: (productId) => api.get(`/products/${productId}/variants`),
  
  createVariants: (productId, variants) => api.post(`/products/${productId}/variants`, { variants }),
  
  updateVariant: (productId, variantId, data) => api.put(`/products/${productId}/variants/${variantId}`, data),
  
  deleteVariant: (productId, variantId) => api.delete(`/products/${productId}/variants/${variantId}`),
};
