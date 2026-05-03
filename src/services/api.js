import axios from 'axios';
import { store } from '../store';
import { logoutUser } from '../store/authSlice';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

api.interceptors.request.use((config) => {
    const token = store.getState().auth?.token
        ?? localStorage.getItem('shoppro_token');
    if (token && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Cache GET requests
    if (config.method === 'get') {
        const cacheKey = config.url +
            JSON.stringify(config.params ?? {});
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.time
            < CACHE_DURATION) {
            config.adapter = (cfg) => Promise.resolve({
                data: cached.data,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: cfg,
            });
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method === 'get') {
            const cacheKey = response.config.url +
                JSON.stringify(
                    response.config.params ?? {}
                );
            cache.set(cacheKey, {
                data: response.data,
                time: Date.now(),
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logoutUser());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Clear cache on mutations (POST/PUT/PATCH/DELETE)
export const clearCache = (urlPattern) => {
    if (urlPattern) {
        cache.forEach((_, key) => {
            if (key.includes(urlPattern)) {
                cache.delete(key);
            }
        });
    } else {
        cache.clear();
    }
};

export default api;
