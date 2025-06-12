import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import {
  fetchFormulasiList,
  deleteFormulasi,
} from "./services/formulasiApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RiwayatFormulasi = () => {
  const [formulasiList, setFormulasiList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFormulasi();
  }, []);

  const fetchFormulasi = async () => {
    try {
      const data = await fetchFormulasiList();
      console.log("✅ Data dari fetchFormulasi:", data);
      setFormulasiList(data);
    } catch (error) {
      console.error("❌ Error saat fetchFormulasi:", error);
      toast.error("Gagal memuat formulasi.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus formulasi ini?")) return;
    try {
      await deleteFormulasi(id);
      toast.success("Formulasi berhasil dihapus.");
      fetchFormulasi();
    } catch (error) {
      toast.error("Gagal menghapus formulasi.");
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

  const filtered = formulasiList.filter((f) =>
    f.nama_formulasi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Riwayat Formulasi
          </h1>

          <input
            type="text"
            placeholder="Cari nama formulasi..."
            className="border p-2 rounded mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Tabel riwayat */}
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
                    onClick={() => navigate(`/detail-formulasi/${formulasi.id}`)}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="py-3 px-4">{formulasi.nama_formulasi}</td>
                    <td className="py-3 px-4">{formulasi.unggas.nama}</td>
                    <td className="py-3 px-4">{formulasi.fase.nama}</td>
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
                          handleDelete(formulasi.id);
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
          </div>

          {/* Jika tidak ada formulasi */}
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
