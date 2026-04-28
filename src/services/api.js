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

// Request interceptor — attach token
api.interceptors.request.use(
    (config) => {
        // Try Redux store first
        const state = store.getState();
        let token = state.auth?.token;

        // Fallback to localStorage
        if (!token) {
            token = localStorage.getItem('shoppro_token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logoutUser());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
