import React, { useState, useEffect, useCallback } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import {
  fetchJenisUnggas,
  fetchFaseByJenisUnggas,
  fetchKebutuhanNutrien,
} from "../services/userApi";
import {
  fetchNutrien,
  createKebutuhanNutrien,
  updateKebutuhanNutrien,
  deleteKebutuhanNutrien,
} from "../services/adminApi";
import { toast } from "react-toastify";

const KebutuhanNutrisiAdmin = () => {
  const [jenisList, setJenisList] = useState([]);
  const [faseList, setFaseList] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedFase, setSelectedFase] = useState("");
  const [data, setData] = useState([]);
  const [nutrienList, setNutrienList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadData = useCallback(() => {
    fetchKebutuhanNutrien(selectedJenis, selectedFase).then(setData);
  }, [selectedJenis, selectedFase]);

  useEffect(() => {
    fetchJenisUnggas().then(setJenisList);
    fetchNutrien().then(setNutrienList);
  }, []);

  useEffect(() => {
    if (selectedJenis) {
      fetchFaseByJenisUnggas(selectedJenis).then(setFaseList);
    }
  }, [selectedJenis]);

  useEffect(() => {
    if (selectedJenis && selectedFase) {
      loadData();
    }
  }, [selectedJenis, selectedFase, loadData]);

  const openModal = (item = null) => {
    setEditing(item || { min_value: "", max_value: "", nutrien: {} });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, nutrien, min_value, max_value } = editing;
    const payload = {
      jenis_unggas: selectedJenis,
      fase: selectedFase,
      nutrien: nutrien.id,
      min_value,
      max_value,
    };

    try {
      if (id) {
        await updateKebutuhanNutrien(id, payload);
        toast.success("Berhasil memperbarui kebutuhan");
      } else {
        await createKebutuhanNutrien(payload);
        toast.success("Berhasil menambahkan kebutuhan");
      }
      closeModal();
      loadData();
    } catch (err) {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteKebutuhanNutrien(id);
      toast.success("Berhasil menghapus");
      loadData();
    } catch (err) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <>
      <HeaderAdmin />
      <div className="container mx-auto mt-6 px-4">
        <h2 className="text-xl font-bold mb-4">Manajemen Kebutuhan Nutrisi Unggas</h2>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <select
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={selectedJenis}
            onChange={(e) => {
              setSelectedJenis(e.target.value);
              setSelectedFase("");
              setData([]);
            }}
          >
            <option value="">Pilih Jenis Unggas</option>
            {jenisList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
          </select>
          <select
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={selectedFase}
            onChange={(e) => setSelectedFase(e.target.value)}
            disabled={!faseList.length}
          >
            <option value="">Pilih Fase</option>
            {faseList.map((f) => (
              <option key={f.id} value={f.fase}>
                {f.fase_nama}
              </option>
            ))}
          </select>
          <button
            className="ml-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
            onClick={() => openModal()}
            disabled={!selectedJenis || !selectedFase}
          >
            Tambah Kebutuhan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border p-2">Nutrien</th>
                <th className="border p-2">Min</th>
                <th className="border p-2">Max</th>
                <th className="border p-2">Satuan</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{item.nutrien.nama}</td>
                  <td className="border p-2">{item.min_value ?? "-"}</td>
                  <td className="border p-2">{item.max_value ?? "-"}</td>
                  <td className="border p-2">{item.nutrien.satuan}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => openModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Manual */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              {editing?.id ? "Edit" : "Tambah"} Kebutuhan Nutrien
            </h3>
            <form onSubmit={handleSubmit}>
              {!editing?.id && (
                <div className="mb-3">
                  <label className="block text-sm mb-1">Nutrien</label>
                  <select
                    className="border w-full px-3 py-2 rounded"
                    value={editing?.nutrien?.id || ""}
                    onChange={(e) => {
                      const nutrien = nutrienList.find(
                        (n) => n.id === parseInt(e.target.value)
                      );
                      setEditing((prev) => ({ ...prev, nutrien }));
                    }}
                    required
                  >
                    <option value="">Pilih nutrien</option>
                    {nutrienList.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-3">
                <label className="block text-sm mb-1">Min Value</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full px-3 py-2 rounded"
                  value={editing?.min_value ?? ""}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      min_value: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-1">Max Value</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full px-3 py-2 rounded"
                  value={editing?.max_value ?? ""}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      max_value: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <FooterAdmin />
    </>
  );
};

export default KebutuhanNutrisiAdmin;
