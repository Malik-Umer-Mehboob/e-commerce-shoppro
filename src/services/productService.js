import api from './api';

export const productService = {
    getProducts: async (filters = {}) => {
        const { isSeller, ...rest } = filters;
        const queryParams = new URLSearchParams(rest).toString();
        const endpoint = isSeller ? '/seller/products' : '/products';
        const response = await api.get(`${endpoint}?${queryParams}`);
        return response.data;
    },
    
    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    
    createProduct: async (productData) => {
        const formData = new FormData();
        
        Object.keys(productData).forEach(key => {
            if (key === 'thumbnail' && productData[key] instanceof File) {
                formData.append('thumbnail', productData[key]);
            } else if (key === 'tags' && Array.isArray(productData[key])) {
                productData[key].forEach(tag => formData.append('tags[]', tag));
            } else if (key === 'is_featured') {
                formData.append('is_featured', productData[key] ? '1' : '0');
            } else if (productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        });

        const response = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    updateProduct: async (id, formData) => {
        // Use POST with _method=PUT for multipart/form-data support in Laravel
        if (formData instanceof FormData) {
            formData.append('_method', 'PUT');
            const response = await api.post(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            const response = await api.put(`/products/${id}`, formData);
            return response.data;
        }
    },
    
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
    
    uploadImages: async (id, images) => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images[]', image);
        });
        const response = await api.post(`/products/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    
    deleteImage: async (productId, imageId) => {
        const response = await api.delete(`/products/${productId}/images/${imageId}`);
        return response.data;
    },
    
    updateStatus: async (id, status) => {
        const response = await api.patch(`/products/${id}/status`, { status });
        return response.data;
    },

    updateModerationStatus: async (id, moderation_status) => {
        const response = await api.patch(`/admin/products/${id}/moderation-status`, { moderation_status });
        return response.data;
    },
    
    getLowStockProducts: async () => {
        const response = await api.get('/admin/products/low-stock');
        return response.data;
    }
};
