import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // ganti jika base URL kamu berbeda

export const fetchJenisUnggas = async () => {
  const response = await axios.get(`${BASE_URL}/jenis-unggas/`);
  return response.data;
};

export const fetchFaseUnggas = async () => {
  const response = await axios.get(`${BASE_URL}/fase-unggas/`);
  return response.data;
};

export const fetchFaseByJenisUnggas = async (jenisUnggasId) => {
  const response = await axios.get(`${BASE_URL}/fase-jenis-unggas/?jenis_unggas=${jenisUnggasId}`);
  return response.data;
}

export const fetchBahanPakan = async () => {
  const response = await axios.get(`${BASE_URL}/bahan-pakan/`);
  return response.data;
};

export const fetchBahanPakanByKategori = async (kategori) => {
    const response = await axios.get(`${BASE_URL}/bahan-pakan/?kategori=${kategori}`);
    return response.data;
}

export const postFormulasi = async (payload) => {
  const response = await axios.post(`${BASE_URL}/formulasi/`, payload);
  return response.data;
}