import API from "./api";

export const postFormulasi = async (payload) => {
  const response = await API.post(`/formulasi/`, payload);
  return response.data;
};

export const postSimpanFormulasi = async (payload) => {
  const response = await API.post(`/formulasi/save/`, payload);
  return response.data;
};