import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens
} from "./tokenService";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(config => {
  const access = getAccessToken();
  if (access) {
    config.headers['Authorization'] = `Bearer ${access}`;
  }
  return config;
});

API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login/' &&
      originalRequest.url !== '/auth/refresh/'
    ) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("Refresh token hilang.");

        const response = await API.post('/auth/refresh/', { refresh });
        const { access } = response.data;

        const remember = !!localStorage.getItem('refresh');
        saveTokens(access, refresh, remember);

        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return API(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;