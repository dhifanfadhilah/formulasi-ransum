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

export const requestPasswordReset = async (email) => {
  const response = await API.post(`/auth/password-reset-request/`, {email});
  return response.data;
}

export const resetPasswordConfirm = async (uid, token, new_password) => {
  const res = await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, {
    uid,
    token,
    new_password
  });
  return res.data;
};