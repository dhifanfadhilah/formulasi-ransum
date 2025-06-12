import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFormulasiById } from "./services/formulasiApi";
import { toast } from "react-toastify";

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
    return <div className="p-6 text-center">Loading...</div>;
  }

  const totalHarga = formulasi.bahan_formulasi.reduce((acc, item) => {
    return acc + item.jumlah * item.bahan_pakan.harga;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Detail Formulasi</h1>

          <div className="mb-6">
            <p className="text-gray-700"><span className="font-semibold">Unggas:</span> {formulasi.unggas.nama}</p>
            <p className="text-gray-700"><span className="font-semibold">Fase:</span> {formulasi.fase.nama}</p>
            <p className="text-gray-700"><span className="font-semibold">Tanggal:</span> {new Date(formulasi.created_at).toLocaleDateString()}</p>
          </div>

          {/* Tabel bahan */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Bahan Pakan</th>
                  <th className="py-3 px-4 text-left">Persentase (%)</th>
                  <th className="py-3 px-4 text-left">Harga per kg (Rp)</th>
                  <th className="py-3 px-4 text-left">Subtotal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {formulasi.bahan_formulasi.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.bahan_pakan.nama}</td>
                    <td className="py-3 px-4">{item.jumlah}</td>
                    <td className="py-3 px-4">{item.bahan_pakan.harga.toLocaleString()}</td>
                    <td className="py-3 px-4">
                       {(item.jumlah * item.bahan_pakan.harga).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Harga */}
          <div className="mt-6 text-right">
            <p className="text-xl font-semibold">
              Total Harga: Rp {totalHarga.toLocaleString()}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 justify-end">
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded">
              Unduh Hasil
            </button>
            <Link
              to="/riwayat-formulasi"
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded text-center"
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
