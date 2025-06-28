import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchFormulasiList, deleteFormulasi } from "./services/formulasiApi";
import { fetchJenisUnggas, fetchFaseByJenisUnggas } from "./services/userApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RiwayatFormulasi = () => {
  const [formulasiList, setFormulasiList] = useState([]);
  const [search, setSearch] = useState("");
  const [jenisUnggasOptions, setJenisUnggasOptions] = useState([]);
  const [faseOptions, setFaseOptions] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedFase, setSelectedFase] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFormulasi();
    fetchJenisUnggas().then(setJenisUnggasOptions);
  }, []);

  const fetchFormulasi = async () => {
    try {
      const data = await fetchFormulasiList();
      setFormulasiList(data);
    } catch (error) {
      toast.error("Gagal memuat formulasi.");
    }
  };

  const handleJenisChange = async (e) => {
    const jenisId = e.target.value;
    setSelectedJenis(jenisId);
    setSelectedFase("");
    if (jenisId) {
      const fase = await fetchFaseByJenisUnggas(jenisId);
      setFaseOptions(
        fase.map((item) => ({
          id: item.fase,
          nama: item.fase_nama,
        }))
      );
    } else {
      setFaseOptions([]);
    }
  };

  const confirmDelete = (id) => {
    setSelectedIdToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteFormulasi(selectedIdToDelete);
      toast.success("Formulasi berhasil dihapus.");
      fetchFormulasi();
    } catch (error) {
      toast.error("Gagal menghapus formulasi.");
    } finally {
      setShowModal(false);
      setSelectedIdToDelete(null);
    }
  };

  const handleDownload = (formulasi) => {
    const doc = new jsPDF();
    doc.text(`Formulasi: ${formulasi.nama_formulasi}`, 10, 10);
    doc.text(`Jenis Unggas: ${formulasi.unggas.nama}`, 10, 20);
    doc.text(`Fase: ${formulasi.fase.nama}`, 10, 30);
    doc.text(
      `Total Biaya: Rp ${formulasi.total_harga.toLocaleString()}`,
      10,
      40
    );
    doc.text(
      `Tanggal: ${new Date(formulasi.created_at).toLocaleDateString()}`,
      10,
      50
    );

    autoTable(doc, {
      startY: 60,
      head: [["Bahan Pakan", "Jumlah (kg)", "Harga/kg"]],
      body: formulasi.bahan_formulasi.map((item) => [
        item.bahan_pakan.nama,
        item.jumlah,
        item.bahan_pakan.harga,
      ]),
    });

    doc.save(`${formulasi.nama_formulasi}.pdf`);
  };

  // Apply search, filter & sort
  const filtered = formulasiList
    .filter((f) =>
      f.nama_formulasi.toLowerCase().includes(search.toLowerCase())
    )
    .filter((f) =>
      selectedJenis ? f.unggas.id.toString() === selectedJenis : true
    )
    .filter((f) =>
      selectedFase ? f.fase.id.toString() === selectedFase : true
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Formulasi Tersimpan
          </h1>

          {/* Redesigned Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cari Nama Formulasi
              </label>
              <input
                type="text"
                placeholder="Contoh: Starter Ayam Broiler"
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Jenis Unggas
              </label>
              <select
                value={selectedJenis}
                onChange={handleJenisChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Semua Jenis</option>
                {jenisUnggasOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fase Pemeliharaan
              </label>
              <select
                value={selectedFase}
                onChange={(e) => setSelectedFase(e.target.value)}
                disabled={!selectedJenis}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Semua Fase</option>
                {faseOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Formulasi</th>
                  <th className="py-3 px-4 text-left">Jenis Unggas</th>
                  <th className="py-3 px-4 text-left">Fase</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((formulasi) => (
                  <tr
                    key={formulasi.id}
                    onClick={() =>
                      navigate(`/detail-formulasi/${formulasi.id}`)
                    }
                    className="border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="py-3 px-4">{formulasi.nama_formulasi}</td>
                    <td className="py-3 px-4">{formulasi.unggas.nama}</td>
                    <td className="py-3 px-4">
                      {formulasi.fase.nama.charAt(0).toUpperCase() +
                        formulasi.fase.nama.slice(1)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(formulasi.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="py-3 px-4 flex flex-col md:flex-row gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(formulasi);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                      >
                        Unduh
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(formulasi.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-80">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Konfirmasi Hapus
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Apakah kamu yakin ingin menghapus formulasi ini? Tindakan
                    ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {formulasiList.length === 0 && (
            <p className="text-gray-600 mt-4 text-center">
              Belum ada formulasi yang dibuat.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RiwayatFormulasi;
