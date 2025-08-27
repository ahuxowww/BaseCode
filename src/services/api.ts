import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: 'https://689bf86458a27b18087c8e79.mockapi.io/api/v1/base',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for request
api.interceptors.request.use(
  config => {
    // const token = authStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

// Interceptor for response
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);
