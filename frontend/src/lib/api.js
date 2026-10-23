import axios from 'axios';

// VITE_API_URL may point to the deployed API; local development uses port 5001.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Menambahkan Authorization Bearer Token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobhunt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Menangani response data & penanganan 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token tidak valid atau kedaluwarsa
      const currentToken = localStorage.getItem('jobhunt_token');
      if (currentToken) {
        localStorage.removeItem('jobhunt_token');
        localStorage.removeItem('jobhunt_user');
        // Jangan auto reload jika sedang di halaman login/register
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
