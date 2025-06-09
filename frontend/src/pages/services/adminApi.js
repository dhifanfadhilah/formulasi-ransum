import API from "./api"; // Sesuai dengan instance axios kamu

export const fetchAllUsers = async () => {
  const response = await API.get(`users/`)
  return response.data;
};

export const updateUserByAdmin = async (userId, updatedFields) => {
  const response = await API.patch(`/users/${userId}/`, updatedFields);
  return response.data;
};

export const deleteUserByAdmin = async (userId) => {
  const response = await API.delete(`/users/${userId}/`);
  return response.data;
};
