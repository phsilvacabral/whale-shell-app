import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
