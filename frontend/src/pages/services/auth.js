import axios from "axios";
import API from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data || { error: "Terjadi kesalahan saat registrasi." };
  }
};