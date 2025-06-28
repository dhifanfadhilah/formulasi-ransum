import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { postSimpanFormulasi } from "./services/formulasiApi";
import { toast } from "react-toastify";
import { getUser } from "./services/tokenService";
import { fetchKebutuhanNutrien } from "./services/userApi";
import { Download, PlusCircle, Repeat } from "lucide-react";

const HasilFormulasiPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasilFormulasi } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [namaFormulasi, setNamaFormulasi] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [kebutuhanNutrien, setKebutuhanNutrien] = useState([]);
  const [jumlahProduksiKg, setJumlahProduksiKg] = useState(1);
  const [hasilHitung, setHasilHitung] = useState([]);

  useEffect(() => {
    const getNutrien = async () => {
      if (hasilFormulasi?.data) {
        const res = await fetchKebutuhanNutrien(
          hasilFormulasi.data.jenis_unggas.id,
          hasilFormulasi.data.fase.id
        );
        setKebutuhanNutrien(res);
      }
    };
    getNutrien();
  }, [hasilFormulasi]);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const prosesHitungProduksi = useCallback(
    (kg = jumlahProduksiKg) => {
      const hasil = hasilFormulasi.data.komposisi.map((item) => {
        const jumlahKg = (kg * item.jumlah) / 100;
        const subtotal = jumlahKg * item.harga_per_kg;
        return { ...item, jumlah_kg: jumlahKg, subtotal };
      });
      setHasilHitung(hasil);
    },
    [hasilFormulasi, jumlahProduksiKg]
  );

  useEffect(() => {
    if (hasilFormulasi?.data?.komposisi) {
      prosesHitungProduksi(1);
    }
  }, [hasilFormulasi, prosesHitungProduksi]);

  const handleHitung = () => {
    if (jumlahProduksiKg > 0) {
      prosesHitungProduksi(jumlahProduksiKg);
    }
  };

  const downloadPDF = () => {
    if (!hasilFormulasi || !hasilFormulasi.data) return;

    const { komposisi, total_biaya } = hasilFormulasi.data;
    const createdAt = hasilFormulasi.data?.created_at;
    const tanggalFormulasi = new Date(createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Hasil Formulasi Ransum Pakan Unggas", 14, 20);

    doc.setFontSize(10);
    doc.text(`Tanggal Formulasi: ${tanggalFormulasi}`, 14, 26);

    doc.setFontSize(12);
    doc.text(
      "Berikut ini adalah komposisi bahan pakan hasil formulasi yang Anda pilih.",
      14,
      30
    );

    const tableData = komposisi.map((item) => [
      item.nama,
      `${item.jumlah.toFixed(2)} %`,
      `Rp ${item.harga_per_kg?.toLocaleString("id-ID") || 0}`,
      `Rp ${item.harga?.toLocaleString("id-ID") || 0}`,
    ]);

    autoTable(doc, {
      head: [
        ["Bahan Pakan", "Persentase (%)", "Harga (Rp/kg)", "Subtotal (Rp)"],
      ],
      body: tableData,
      startY: 40,
    });

    doc.text(
      `Total Biaya: Rp ${total_biaya.toLocaleString("id-ID")} /kg`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Jenis Unggas: ${hasilFormulasi.data?.jenis_unggas?.nama}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Fase: ${hasilFormulasi.data?.fase?.nama}`,
      14,
      doc.lastAutoTable.finalY + 28
    );
    doc.save("hasil_formulasi.pdf");
  };

  if (!hasilFormulasi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>
          Tidak ada hasil formulasi.{" "}
          <button
            onClick={() => navigate("/formulasi")}
            className="text-blue-600 underline"
          >
            Kembali
          </button>
        </p>
      </div>
    );
  }

  const handleSimpan = async () => {
    setError("");
    setSuccess("");
    if (!namaFormulasi.trim()) {
      setError("Nama formulasi wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        nama_formulasi: namaFormulasi,
        jenis_unggas: hasilFormulasi.data.jenis_unggas.id,
        fase: hasilFormulasi.data.fase.id,
        komposisi: hasilFormulasi.data.komposisi.map((item) => ({
          bahan_pakan_id: item.bahan_pakan_id,
          jumlah: item.jumlah,
        })),
        kandungan_nutrien: hasilFormulasi.data.kandungan_nutrien,
      };
      await postSimpanFormulasi(payload);
      setSuccess("Formulasi berhasil disimpan!");
      toast.success("Formulasi berhasil disimpan!");
      setShowModal(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Gagal menyimpan formulasi.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getSingkatan = (nama) => {
    const map = {
      "Kadar Air": "KA",
      "Protein Kasar": "PK",
      "Lemak Kasar": "LK",
      "Serat Kasar": "SK",
      Kalsium: "Ca",
      "Energi Metabolisme": "EM",
      Lysine: "lys",
      Methionine: "met",
      "Methionine + Cystine": "met+sis",
      "Fosfor Total": "Ptotal",
      "Fosfor Tersedia": "Pavl",
      Abu: "Abu",
    };
    return map[nama] || nama.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            Hasil Formulasi Ransum
          </h2>
          <p className="text-md md:text-lg text-gray-600">
            Komposisi bahan pakan berdasarkan kebutuhan nutrien unggas
          </p>
        </div>

        {/* Ringkasan Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-white border border-green-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Jenis Unggas</p>
            <p className="text-xl font-semibold text-green-800">
              {hasilFormulasi.data?.jenis_unggas?.nama}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-green-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Fase Pertumbuhan</p>
            <p className="text-xl font-semibold text-green-800 capitalize">
              {hasilFormulasi.data?.fase?.nama}
            </p>
          </div>
        </div>

        {/* Tabel Nutrien */}
        {kebutuhanNutrien.length > 0 && (
          <div className="overflow-x-auto mb-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Kebutuhan Nutrien & Kandungan Aktual
            </h3>
            <table className="min-w-full border text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  {kebutuhanNutrien.map((item, idx) => (
                    <th key={idx} className="px-3 py-2 border text-center">
                      {getSingkatan(item.nutrien.nama)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-50">
                  {kebutuhanNutrien.map((item, idx) => {
                    const min = item.min_value;
                    const max = item.max_value;
                    let label = "-";
                    if (min != null && max != null) label = `${min} - ${max}`;
                    else if (min != null) label = `≥ ${min}`;
                    else if (max != null) label = `≤ ${max}`;
                    return (
                      <td key={idx} className="text-center px-3 py-2 border">
                        {label}
                      </td>
                    );
                  })}
                </tr>
                <tr className="bg-green-100 font-semibold">
                  {kebutuhanNutrien.map((item, idx) => {
                    const nutrienAktual =
                      hasilFormulasi.data.kandungan_nutrien.find(
                        (n) => n.nama === item.nutrien.nama
                      );
                    return (
                      <td key={idx} className="text-center px-3 py-2 border">
                        {nutrienAktual
                          ? nutrienAktual.aktual.toFixed(2)
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              {kebutuhanNutrien
                .map(
                  (item) =>
                    `${getSingkatan(item.nutrien.nama)} = ${item.nutrien.nama}`
                )
                .join(" | ")}
            </p>
          </div>
        )}

        {/* Input & Tabel Hasil */}
        <div className="mb-6 max-w-md">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Jumlah Ransum yang Ingin Dibuat (kg)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min={1}
              value={jumlahProduksiKg}
              onChange={(e) => setJumlahProduksiKg(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            />
            <button
              onClick={handleHitung}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              Hitung
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full text-sm border border-gray-300 rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 border text-left">Bahan Pakan</th>
                <th className="px-4 py-2 border text-center">Harga (Rp/kg)</th>
                <th className="px-4 py-2 border text-center">Persentase (%)</th>
                <th className="px-4 py-2 border text-center">Jumlah (kg)</th>
                <th className="px-4 py-2 border text-center">Subtotal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {hasilHitung
                .sort((a, b) => b.jumlah - a.jumlah)
                .map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all border-b"
                  >
                    <td className="px-4 py-2 border">{item.nama}</td>
                    <td className="px-4 py-2 border text-center">
                      Rp {item.harga_per_kg?.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {item.jumlah.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {item.jumlah_kg.toFixed(2)} kg
                    </td>
                    <td className="px-4 py-2 border text-center">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-xl font-semibold text-green-800 mb-10">
          Total Biaya: Rp{" "}
          {hasilFormulasi.data?.total_biaya.toLocaleString("id-ID")} /kg
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md"
          >
            <Download size={18} /> Unduh PDF
          </button>
          <a
            href="/formulasi"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
          >
            <Repeat size={18} /> Formulasi Lagi
          </a>
          {user ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow-md"
            >
              <PlusCircle size={18} /> Simpan Formulasi
            </button>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-2">
              Login untuk menyimpan hasil formulasi.
            </p>
          )}
        </div>

        {/* Modal Simpan */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Simpan Formulasi</h2>

              {error && <p className="text-red-600 mb-2">{error}</p>}
              {success && <p className="text-green-600 mb-2">{success}</p>}

              <input
                type="text"
                placeholder="Masukkan nama formulasi..."
                value={namaFormulasi}
                onChange={(e) => setNamaFormulasi(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleSimpan}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HasilFormulasiPage;
