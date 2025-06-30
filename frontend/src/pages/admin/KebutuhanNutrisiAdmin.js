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
import SideBarAdmin from "./components/SideBarAdmin";

const KebutuhanNutrisiAdmin = () => {
  const [jenisList, setJenisList] = useState([]);
  const [faseList, setFaseList] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedFase, setSelectedFase] = useState("");
  const [data, setData] = useState([]);
  const [nutrienList, setNutrienList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  useEffect(() => {
    document.title = "PakanUnggas - Manajemen Kebutuhan Nutrisi"; 
  }, []);

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

  const parseNumber = (value) => {
    if (value === "" || value === null || isNaN(Number(value))) return null;
    return Number(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const { id, nutrien, min_value, max_value } = editing;
    const payload = {
      jenis_unggas: selectedJenis,
      fase: selectedFase,
      nutrien_id: nutrien.id,
      min_value: parseNumber(min_value),
      max_value: parseNumber(max_value),
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteKebutuhanNutrien(deletingItem.id);
      toast.success("Berhasil menghapus");
      loadData();
    } catch (err) {
      toast.error("Gagal menghapus");
    } finally {
      setDeleteConfirmOpen(false);
      setDeletingItem(null);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      <SideBarAdmin
        open={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <div className="flex flex-1 flex-col">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <div className="container mx-auto mt-6 px-4 flex-grow">
          <h2 className="text-xl font-bold mb-4">
            Manajemen Kebutuhan Nutrisi Unggas
          </h2>

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
                  {f.fase_nama.charAt(0).toUpperCase() + f.fase_nama.slice(1)}
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
                        onClick={() => handleDelete(item)}
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
                    value={editing?.min_value !== null ? editing.min_value : ""}
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
                    value={editing?.max_value !== null ? editing.max_value : ""}
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
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
              <p className="mb-6">
                Apakah Anda yakin ingin menghapus kebutuhan nutrien{" "}
                <span className="font-semibold">
                  {deletingItem?.nutrien?.nama}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        <FooterAdmin />
      </div>
    </div>
  );
};

export default KebutuhanNutrisiAdmin;
