import API from './api';

export const fetchJenisUnggas = async () => {
  const response = await API.get('/jenis-unggas/');
  return response.data;
};

export const fetchFaseUnggas = async () => {
  const response = await API.get('/fase-unggas/');
  return response.data;
};

export const fetchFaseByJenisUnggas = async (jenisUnggasId) => {
  const response = await API.get('/fase-jenis-unggas/?jenis_unggas=${jenisUnggasId}');
  return response.data;
}

export const fetchBahanPakan = async () => {
  const response = await API.get('/bahan-pakan/');
  return response.data;
};

export const fetchBahanPakanByKategori = async (kategori) => {
    const response = await API.get('/bahan-pakan/?kategori=${kategori}');
    return response.data;
}

export const postFormulasi = async (payload) => {
  const response = await API.post('/formulasi/', payload);
  return response.data;
}