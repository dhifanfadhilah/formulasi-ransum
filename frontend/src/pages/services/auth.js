import API from "./api";
import { getRefreshToken } from "./tokenService";

export const registerUser = async (userData) => {
  try {
    const response = await API.post(`/auth/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data || { error: "Terjadi kesalahan saat registrasi." };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login/', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login gagal.' };
  }
};

export const logoutUser = async () => {
  const refresh = getRefreshToken();

  try {
    if (refresh) {
      await API.post('/auth/logout/', { refresh });
    }
  } catch (err) {
    // Token mungkin sudah tidak valid, bisa diabaikan
    console.error("Logout error:", err);
  }
};