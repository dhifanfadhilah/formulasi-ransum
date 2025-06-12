import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { postSimpanFormulasi } from "./services/formulasiApi";
import { toast } from "react-toastify";
import { getUser } from "./services/tokenService";

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
      const errorMsg = err.response?.data?.detail || "Gagal menyimpan formulasi.";
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
        <h2 className="text-3xl font-bold mb-6 text-center">
          Hasil Formulasi Ransum
        </h2>
        <h3 className="text-2xl font-semibold mb-2">Detail Hasil Formulasi</h3>
        <p className="text-lg mb-6">
          Berikut adalah hasil formulasi pakan berdasarkan bahan pakan dan jenis
          unggas yang Anda pilih.
        </p>

        <h4 className="text-lg font-semibold mb-1">
          Jenis Unggas:{" "}
          <span className="font-semibold">
            {hasilFormulasi.data?.jenis_unggas?.nama}
          </span>
        </h4>
        <h4 className="text-lg font-semibold mb-1">
          Fase:{" "}
          <span className="font-semibold">
            {hasilFormulasi.data?.fase?.nama}
          </span>
        </h4>

        <table className="w-full border border-gray-300 mb-6 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Bahan Pakan</th>
              <th className="border px-4 py-2 text-left">Persentase (%)</th>
              <th className="border px-4 py-2 text-left">Harga (Rp/kg)</th>
            </tr>
          </thead>
          <tbody>
            {hasilFormulasi.data?.komposisi?.map((item, idx) => (
              <tr key={item.bahan_pakan_id}>
                <td className="border px-4 py-2">{item.nama}</td>
                <td className="border px-4 py-2">{item.jumlah.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  Rp {item.harga?.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-xl font-semibold mb-10">
          Total Biaya: Rp{" "}
          {hasilFormulasi.data?.total_biaya.toLocaleString("id-ID")} /kg
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
          >
            Unduh Hasil Formulasi
          </button>
          <a
            href="/formulasi"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow text-center"
          >
            Formulasi Lagi
          </a>
          {user ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded shadow"
            >
              Simpan Formulasi
            </button>
          ) : (
            <p className="text-sm text-gray-500">Login untuk menyimpan hasil formulasi.</p>
          )}
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Simpan Formulasi</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}
            <input
              type="text"
              placeholder="Nama formulasi"
              value={namaFormulasi}
              onChange={(e) => setNamaFormulasi(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
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
