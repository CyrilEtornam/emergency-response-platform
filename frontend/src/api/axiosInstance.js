import axios from 'axios';
import logger from '../utils/logger';

// ─── In-memory token store ───────────────────────────────────────────────────
let _accessToken = null;

export function setAccessToken(token) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

export function clearAccessToken() {
  _accessToken = null;
}

// ─── Axios instances per service ─────────────────────────────────────────────
export const authAxios = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const incidentAxios = axios.create({
  baseURL: process.env.REACT_APP_INCIDENT_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const dispatchAxios = axios.create({
  baseURL: process.env.REACT_APP_DISPATCH_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const analyticsAxios = axios.create({
  baseURL: process.env.REACT_APP_ANALYTICS_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Refresh logic ────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  // Use a plain axios call (no interceptors) to avoid a 401 retry loop
  const response = await axios.post(
    `${process.env.REACT_APP_AUTH_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const data = response.data?.data || response.data;
  const newToken = data.accessToken;
  setAccessToken(newToken);
  // Auth-service rotates the refresh token — save the new one
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return newToken;
}

function handleTokenExpiry() {
  clearAccessToken();
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

// ─── Interceptors factory ─────────────────────────────────────────────────────
function attachInterceptors(instance) {
  // Request: attach Bearer token
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: on 401 try refresh once, then retry
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          logger.warn('Token refresh failed, redirecting to login');
          handleTokenExpiry();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Normalise error shape
      const status = error.response?.status || 0;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred';

      return Promise.reject({ message, status });
    }
  );
}

// authAxios only gets the Bearer token injector — NOT the 401 refresh logic.
// Auth endpoints (/auth/refresh, /users, etc.) must not trigger the refresh loop.
authAxios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

attachInterceptors(incidentAxios);
attachInterceptors(dispatchAxios);
attachInterceptors(analyticsAxios);
