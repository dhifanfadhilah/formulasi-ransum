import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { fetchFormulasiById } from "./services/formulasiApi";
import { toast } from "react-toastify";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DetailFormulasi = () => {
  const { id } = useParams();
  const [formulasi, setFormulasi] = useState(null);
  const [jumlahProduksi, setJumlahProduksi] = useState(1);
  const [hasilProduksi, setHasilProduksi] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchFormulasiById(id);
        setFormulasi(data);
      } catch (err) {
        toast.error("Gagal memuat detail formulasi.");
      }
    };
    getData();
  }, [id]);

  const hitungProduksi = useCallback((kg, bahanFormulasi) => {
    const hasil = bahanFormulasi.map((item) => {
      const jumlahKg = (kg * item.jumlah) / 100;
      const subtotal = jumlahKg * item.bahan_pakan.harga;
      return { ...item, jumlah_kg: jumlahKg, subtotal };
    });
    setHasilProduksi(hasil);
  }, []);

  useEffect(() => {
    if (formulasi?.bahan_formulasi) {
      hitungProduksi(1, formulasi.bahan_formulasi);
    }
  }, [formulasi, hitungProduksi]);

  const handleHitung = () => {
    if (jumlahProduksi > 0) {
      hitungProduksi(jumlahProduksi, formulasi.bahan_formulasi);
    }
  };

  const totalHarga = formulasi?.bahan_formulasi.reduce(
    (acc, item) => acc + (item.jumlah / 100) * item.bahan_pakan.harga,
    0
  );

  const downloadPDF = () => {
    if (!formulasi) return;

    const doc = new jsPDF();
    const tanggalFormulasi = formatTanggal(formulasi.created_at);
    const komposisi = hasilProduksi;
    const kandungan = formulasi.kandungan_nutrien;

    // Judul
    doc.setFontSize(16);
    doc.text("Detail Formulasi Ransum Pakan Unggas", 14, 20);

    // Info Umum
    doc.setFontSize(10);
    doc.text(`Tanggal: ${tanggalFormulasi}`, 14, 28);
    doc.text(`Jenis Unggas: ${formulasi.unggas.nama}`, 14, 34);
    doc.text(`Fase: ${formulasi.fase.nama}`, 14, 40);

    // Komposisi Bahan
    doc.setFontSize(12);
    doc.text("Komposisi Bahan Pakan:", 14, 48);
    autoTable(doc, {
      head: [["Bahan", "Persentase (%)", "Harga (Rp/kg)", "Subtotal (Rp)"]],
      body: komposisi.map((item) => [
        item.bahan_pakan.nama,
        `${parseFloat(item.jumlah).toFixed(2)} %`,
        `Rp ${item.bahan_pakan.harga.toLocaleString("id-ID")}`,
        `Rp ${item.subtotal.toLocaleString("id-ID")}`,
      ]),
      startY: 54,
      styles: { fontSize: 10 },
    });

    const afterKomposisiY = doc.lastAutoTable.finalY + 6;

    // Total Harga
    doc.setFontSize(11);
    doc.text(
      `Total Biaya: Rp ${totalHarga.toLocaleString("id-ID")} /kg`,
      14,
      afterKomposisiY
    );

    const afterHargaY = afterKomposisiY + 10;

    // Nutrien
    doc.setFontSize(12);
    doc.text("Kebutuhan dan Kandungan Nutrien:", 14, afterHargaY);

    autoTable(doc, {
      startY: afterHargaY + 6,
      head: [kandungan.map((item) => item.kode)],
      body: [
        kandungan.map((item) => {
          const min = item.dibutuhkan_min;
          const max = item.dibutuhkan_max;
          if (min != null && max != null) return `${min} - ${max}`;
          if (min != null) return `>= ${min}`;
          if (max != null) return `<= ${max}`;
          return "-";
        }),
        kandungan.map((item) => item.aktual.toFixed(2)),
      ],
      styles: { fontSize: 9 },
    });

    // Footer
    const bottom = doc.internal.pageSize.height - 10;
    doc.setFontSize(8);
    doc.text(
      "Dokumen ini dihasilkan otomatis dari sistem formulasi berbasis Linear Programming",
      14,
      bottom
    );

    const fileName = `Formulasi_${formulasi.unggas.nama}_${formulasi.fase.nama}.pdf`;
    doc.save(fileName.replace(/\s+/g, "_"));
  };

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (!formulasi) {
    return <div className="p-6 text-center">Memuat data formulasi...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Header Detail */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">
              Detail Formulasi Ransum
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Rincian formulasi pakan unggas tersimpan
            </p>
          </div>

          {/* Info Umum */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg text-sm md:text-base">
            <p>
              <span className="font-semibold text-green-700">
                Jenis Unggas:
              </span>{" "}
              {formulasi.unggas.nama}
            </p>
            <p>
              <span className="font-semibold text-green-700">Fase:</span>{" "}
              {formulasi.fase.nama.charAt(0).toUpperCase() +
                formulasi.fase.nama.slice(1)}
            </p>
            <p>
              <span className="font-semibold text-green-700">Tanggal:</span>{" "}
              {formatTanggal(formulasi.created_at)}
            </p>
          </div>

          {/* Tabel Nutrien */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th
                    colSpan={formulasi.kandungan_nutrien.length}
                    className="text-center py-2 text-base"
                  >
                    Kebutuhan & Kandungan Nutrien
                  </th>
                </tr>
                <tr>
                  {formulasi.kandungan_nutrien.map((item, idx) => (
                    <th key={idx} className="px-3 py-2 border text-center">
                      {item.kode}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  {formulasi.kandungan_nutrien.map((item, idx) => {
                    const min = item.dibutuhkan_min;
                    const max = item.dibutuhkan_max;
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
                  {formulasi.kandungan_nutrien.map((item, idx) => (
                    <td key={idx} className="text-center px-3 py-2 border">
                      {item.aktual.toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2 px-2">
              {formulasi.kandungan_nutrien
                .map((item) => `${item.kode} = ${item.nama}`)
                .join(" | ")}
            </p>
          </div>

          {/* Input Produksi */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Jumlah Produksi (kg)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min={1}
                value={jumlahProduksi}
                onChange={(e) => setJumlahProduksi(Number(e.target.value))}
                className="border px-4 py-2 rounded w-40"
              />
              <button
                onClick={handleHitung}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Hitung
              </button>
            </div>
          </div>

          {/* Tabel Komposisi Bahan */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Bahan Pakan</th>
                  <th className="px-4 py-2 text-left">Harga (Rp/kg)</th>
                  <th className="px-4 py-2 text-left">Penggunaan (%)</th>
                  <th className="px-4 py-2 text-left">Jumlah (kg)</th>
                  <th className="px-4 py-2 text-left">Subtotal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {hasilProduksi
                  .sort((a, b) => b.jumlah - a.jumlah)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2">{item.bahan_pakan.nama}</td>
                      <td className="px-4 py-2">
                        Rp{" "}
                        {Number(item.bahan_pakan.harga).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2">{item.jumlah} %</td>
                      <td className="px-4 py-2">
                        {item.jumlah_kg.toFixed(2)} kg
                      </td>
                      <td className="px-4 py-2">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Total Biaya */}
          <div className="bg-green-50 p-4 rounded-lg text-right text-lg font-semibold text-green-700">
            Total Harga: Rp{" "}
            {totalHarga.toLocaleString("id-ID", { maximumFractionDigits: 0 })}{" "}
            /kg
          </div>

          {/* Aksi */}
          <div className="flex flex-col md:flex-row gap-3 justify-end mt-4">
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              <FileDown size={18} />
              Unduh Hasil
            </button>
            <Link
              to="/riwayat-formulasi"
              className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded text-center"
            >
              Kembali ke Riwayat
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailFormulasi;
