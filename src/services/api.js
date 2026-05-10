import axios from 'axios';
import { store } from '../store';
import { logoutUser } from '../store/authSlice';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth?.token
        ?? localStorage.getItem('shoppro_token');
    if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginRoute =
                error.config?.url?.includes('/auth/login');
            if (!isLoginRoute) {
                store.dispatch(logoutUser());
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
