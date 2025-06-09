import API from './api';

export const fetchJenisUnggas = async () => {
  const response = await API.get(`/jenis-unggas/`);
  return response.data;
};

export const fetchFaseUnggas = async () => {
  const response = await API.get(`/fase-unggas/`);
  return response.data;
};

export const fetchFaseByJenisUnggas = async (jenisUnggasId) => {
  const response = await API.get(`/fase-jenis-unggas/?jenis_unggas=${jenisUnggasId}`);
  return response.data;
};

export const fetchBahanPakan = async () => {
  const response = await API.get(`/bahan-pakan/`);
  return response.data;
};

export const fetchBahanPakanByKategori = async (kategori) => {
    const response = await API.get(`/bahan-pakan/?kategori=${kategori}`);
    return response.data;
};

export const postFormulasi = async (payload) => {
  const response = await API.post(`/formulasi/`, payload);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await API.get(`/users/${userId}/`);
  return response.data;
};

export const updateUserProfile = async (userId, updateDate) => {
  const response = await API.patch(`/users/${userId}/`, updateDate);
  return response.data;
}

export const changePassword = async (formData) => {
  const response = await API.post(`/auth/change-password/`, formData);
  return response.data;
};

export const fetchKebutuhanNutrien = async (jenisUnggasId, faseId) => {
  const response = await API.get(`/kebutuhan-nutrien/?jenis_unggas=${jenisUnggasId}&fase=${faseId}`);
  return response.data;
}