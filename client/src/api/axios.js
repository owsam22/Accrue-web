import axios from 'axios';

// Base URL from environment — change .env only; no code changes needed
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accrue_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accrue_token');
      localStorage.removeItem('accrue_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
