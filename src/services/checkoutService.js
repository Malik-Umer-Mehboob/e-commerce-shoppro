import api from './api';

const checkoutService = {
    placeOrder: (data) => api.post('/checkout', data),
    getShippingZones: () => api.get('/shipping/zones'),
    calculateShipping: (city) =>
        api.post('/shipping/calculate', { city }),
    getSavedAddresses: () => api.get('/user/addresses'),
};

export default checkoutService;
