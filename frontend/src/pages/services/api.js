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
        console.error("Token refresh gagal:", err);
        clearTokens();
        alert("Sesi berakhir. Silakan login kembali.");
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      console.warn("Akses ditolak. Anda mungkin tidak memiliki izin.");
      alert("Sesi Anda telah berakhir atau akses ditolak. Silakan login ulang.");
      clearTokens();
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default API;