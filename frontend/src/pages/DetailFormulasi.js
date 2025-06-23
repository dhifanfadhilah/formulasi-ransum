import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFormulasiById } from "./services/formulasiApi";
import { toast } from "react-toastify";
import { FileDown } from "lucide-react";

const DetailFormulasi = () => {
  const { id } = useParams();
  const [formulasi, setFormulasi] = useState(null);

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

  if (!formulasi) {
    return <div className="p-6 text-center">Memuat data formulasi...</div>;
  }

  const totalHarga = formulasi.bahan_formulasi.reduce(
    (acc, item) => acc + item.jumlah * item.bahan_pakan.harga,
    0
  );

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
          {/* Header Detail */}
          <div>
            <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
              Detail Formulasi
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Informasi hasil formulasi ransum unggas</p>
          </div>

          {/* Info Umum */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg">
            <p>
              <span className="font-semibold text-green-700">Jenis Unggas:</span> {formulasi.unggas.nama}
            </p>
            <p>
              <span className="font-semibold text-green-700">Fase:</span> {formulasi.fase.nama.charAt(0).toUpperCase() + formulasi.fase.nama.slice(1)}
            </p>
            <p>
              <span className="font-semibold text-green-700">Tanggal:</span> {formatTanggal(formulasi.created_at)}
            </p>
          </div>

          {/* Tabel bahan */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-green-600 text-white text-left">
                <tr>
                  <th className="py-3 px-4">Bahan Pakan</th>
                  <th className="py-3 px-4">Persentase (%)</th>
                  <th className="py-3 px-4">Harga per kg (Rp)</th>
                  <th className="py-3 px-4">Subtotal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {[...formulasi.bahan_formulasi]
                .sort((a, b) => b.jumlah - a.jumlah)
                .map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-3 px-4">{item.bahan_pakan.nama}</td>
                    <td className="py-3 px-4">{item.jumlah} %</td>
                    <td className="py-3 px-4">Rp {item.bahan_pakan.harga.toLocaleString("id-ID")}</td>
                    <td className="py-3 px-4">
                      Rp {(item.jumlah * item.bahan_pakan.harga).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Harga */}
          <div className="bg-green-50 p-4 rounded-lg text-right">
            <p className="text-xl font-bold text-green-700">
              Total Harga: Rp {totalHarga.toLocaleString()}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col md:flex-row gap-4 justify-end mt-6">
            <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg">
              <FileDown size={18} />
              Unduh Hasil
            </button>
            <Link
              to="/riwayat-formulasi"
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded-lg text-center"
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
