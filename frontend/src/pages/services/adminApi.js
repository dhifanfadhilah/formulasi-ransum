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

export const fetchBahanPakan = (kategori) =>
  API.get('/bahan-pakan/', { params: kategori ? { kategori } : {} }).then(r => r.data);

export const createBahanPakan = (data) =>
  API.post('/bahan-pakan/', data).then(r => r.data);

export const updateBahanPakan = (id, data) =>
  API.put(`/bahan-pakan/${id}/`, data).then(r => r.data);

export const deleteBahanPakan = (id) =>
  API.delete(`/bahan-pakan/${id}/`);

export const fetchNutrien = () =>
  API.get('/nutrien/').then(r => r.data);

export const fetchKandunganByBahan = (bahanId) =>
  API.get('/kandungan-nutrien/', { params: { bahan_pakan: bahanId } }).then(r => r.data);

export const createKandungan = (data) =>
  API.post('/kandungan-nutrien/', data).then(r => r.data);

export const updateKandungan = (id, data) =>
  API.put(`/kandungan-nutrien/${id}/`, data).then(r => r.data);

export const deleteKandungan = (id) =>
  API.delete(`/kandungan-nutrien/${id}/`);

export const createKebutuhanNutrien = (data) =>
  API.post('/kebutuhan-nutrien/', data).then(r => r.data);

export const updateKebutuhanNutrien = (id, data) =>
  API.put(`/kebutuhan-nutrien/${id}/`, data).then(r => r.data);

export const deleteKebutuhanNutrien = (id) =>
  API.delete(`/kebutuhan-nutrien/${id}/`);