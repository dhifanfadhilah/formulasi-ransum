import API from "./api";

export const postFormulasi = async (payload) => {
  const response = await API.post(`/formulasi/`, payload);
  return response.data;
};

export const postSimpanFormulasi = async (payload) => {
  const response = await API.post(`/formulasi/save/`, payload);
  return response.data;
};

export const fetchFormulasiList = async () => {
    const reponse = await API.get(`/hasil-formulasi/`);
    return reponse.data;
};

export const fetchFormulasiById = async (id) => {
    const reponse = await API.get(`/hasil-formulasi/${id}/`);
    return reponse.data;
};

export const deleteFormulasi = async (id) => {
    const reponse = await API.delete(`/hasil-formulasi/${id}/`);
    return reponse.data;
};

export const updateFormulasiNama = (id, nama_formulasi) =>
  API.patch(`/hasil-formulasi/${id}/`, { nama_formulasi });