import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor for injecting JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skinwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s and standardized error payloads
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // If unauthenticated or token expired, clean token
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
          localStorage.removeItem('skinwise_token');
          localStorage.removeItem('skinwise_user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data || { message: 'An error occurred' });
    }
    return Promise.reject({ message: error.message || 'Network connection failed' });
  }
);

export default apiClient;
