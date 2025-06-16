import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { postSimpanFormulasi } from "./services/formulasiApi";
import { toast } from "react-toastify";
import { getUser } from "./services/tokenService";
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

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const downloadCSV = () => {
    if (!hasilFormulasi || !hasilFormulasi.data) return;

    const { komposisi, total_biaya } = hasilFormulasi.data;

    let csvContent = "Bahan Pakan,Persentase (%),Harga (Rp/kg),Subtotal (Rp)\n";

    komposisi.forEach((item) => {
      const subtotal = (item.jumlah / 100) * item.harga;
      csvContent += `${item.nama},${item.jumlah.toFixed(2)},${
        item.harga
      },${subtotal.toFixed(2)}\n`;
    });

    csvContent += `\nTotal Biaya,,,"${total_biaya}"\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hasil_formulasi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    // Siapkan data untuk tabel
    const tableData = komposisi.map((item) => [
      item.nama,
      `${item.jumlah.toFixed(2)} %`,
      `Rp ${item.harga.toLocaleString("id-ID")}`,
      `Rp ${((item.jumlah / 100) * item.harga).toFixed(2)}`,
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
        total_harga: hasilFormulasi.data.total_biaya,
        jenis_unggas: hasilFormulasi.data.jenis_unggas.id,
        fase: hasilFormulasi.data.fase.id,
        komposisi: hasilFormulasi.data.komposisi.map((item) => ({
          bahan_pakan_id: item.bahan_pakan_id,
          jumlah: item.jumlah,
        })),
      };

      console.log("Payload yang dikirim:", payload);

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

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Hasil Formulasi Ransum
          </h2>
          <p className="text-lg text-gray-600">
            Komposisi pakan unggas berdasarkan bahan dan kebutuhan nutrien
          </p>
        </div>

        {/* Info Ringkas */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <p className="text-gray-500 text-sm">Jenis Unggas</p>
            <p className="text-xl font-semibold text-gray-800">
              {hasilFormulasi.data?.jenis_unggas?.nama}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <p className="text-gray-500 text-sm">Fase Pemeliharaan</p>
            <p className="text-xl font-semibold text-gray-800">
              {hasilFormulasi.data?.fase?.nama.charAt(0).toUpperCase() +
                hasilFormulasi.data?.fase?.nama.slice(1)}
            </p>
          </div>
        </div>

        {/* Tabel Hasil */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2 border">Bahan Pakan</th>
                <th className="text-left px-4 py-2 border">Persentase (%)</th>
                <th className="text-left px-4 py-2 border">Harga (Rp/kg)</th>
              </tr>
            </thead>
            <tbody>
              {[...hasilFormulasi.data?.komposisi]
              .sort((a, b) => b.jumlah - a.jumlah)
              .map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="px-4 py-2 border">{item.nama}</td>
                  <td className="px-4 py-2 border">{item.jumlah.toFixed(2)}</td>
                  <td className="px-4 py-2 border">
                    Rp {item.harga?.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Biaya */}
        <div className="text-right text-xl font-semibold text-gray-700 mb-10">
          Total Biaya: Rp{" "}
          {hasilFormulasi.data?.total_biaya.toLocaleString("id-ID")} /kg
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
          >
            <Download size={18} /> Unduh PDF
          </button>
          <a
            href="/formulasi"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow"
          >
            <Repeat size={18} /> Formulasi Lagi
          </a>
          {user ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded shadow"
            >
              <PlusCircle size={18} /> Simpan Formulasi
            </button>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Login untuk menyimpan hasil formulasi.
            </p>
          )}
        </div>
      </main>

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

      <Footer />
    </div>
  );
};

export default HasilFormulasiPage;
