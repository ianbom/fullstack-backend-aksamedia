import axios from 'axios';
import { getStorageItem, removeStorageItem, STORAGE_KEYS } from './storage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://be-aksamedia.iandev.my.id/api',
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
            removeStorageItem(STORAGE_KEYS.AUTH_USER);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
