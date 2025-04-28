import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const RiwayatFormulasi = () => {
  // Dummy data untuk contoh
  const formulasiList = [
    {
      id: 1,
      unggas: "Ayam Broiler",
      fase: "Starter",
      tanggal: "27 April 2025",
    },
    {
      id: 2,
      unggas: "Ayam Petelur",
      fase: "Layer",
      tanggal: "25 April 2025",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Riwayat Formulasi</h1>

          {/* Tabel riwayat */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Unggas</th>
                  <th className="py-3 px-4 text-left">Fase</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formulasiList.map((formulasi) => (
                  <tr key={formulasi.id} className="border-b">
                    <td className="py-3 px-4">{formulasi.unggas}</td>
                    <td className="py-3 px-4">{formulasi.fase}</td>
                    <td className="py-3 px-4">{formulasi.tanggal}</td>
                    <td className="py-3 px-4 flex flex-col md:flex-row gap-2">
                      <Link
                        to={`/formulasi/${formulasi.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-center"
                      >
                        Lihat Detail
                      </Link>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                      >
                        Unduh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Jika tidak ada formulasi */}
          {formulasiList.length === 0 && (
            <p className="text-gray-600 mt-4 text-center">Belum ada formulasi yang dibuat.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RiwayatFormulasi;
