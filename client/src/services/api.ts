import axios from 'axios';

/**
 * Axios Instance — centralized API client.
 *
 * WHY use an Axios instance instead of raw fetch/axios?
 * ┌──────────────────────────────────────────────────────────┐
 * │ Without instance: You'd repeat the base URL and headers │
 * │ in EVERY API call across your entire app.               │
 * │                                                         │
 * │ With instance: Configure ONCE, use everywhere.          │
 * │ - Base URL set once                                     │
 * │ - Auth token attached automatically                     │
 * │ - Error handling in one place                           │
 * └──────────────────────────────────────────────────────────┘
 *
 * HOW IT CONNECTS TO THE BACKEND:
 * Frontend (port 5173) → Vite proxy → Backend (port 5000)
 *
 * The Vite dev server proxies /api/* requests to localhost:5000.
 * In production, you'd point baseURL to your deployed API.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor — runs BEFORE every request.
 *
 * Automatically attaches the JWT token from localStorage
 * to every outgoing request. This way, you don't need to
 * manually add the Authorization header in every API call.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor — runs AFTER every response.
 *
 * Handles common error scenarios globally:
 * - 401: Token expired or invalid → redirect to login
 * - Other errors: Pass through to the calling code
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid — clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
