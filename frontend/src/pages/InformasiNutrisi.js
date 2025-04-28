import Header from "../components/Header";
import Footer from "../components/Footer";

const InformasiNutrisi = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Informasi Kebutuhan Nutrisi Unggas</h1>

        <div className="max-w-4xl mx-auto">
          {/* Pilihan Jenis Unggas */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Pilih Jenis Unggas</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Ayam Pedaging</option>
              <option>Ayam Petelur</option>
              <option>Itik</option>
              <option>Puyuh</option>
              {/* Tambahkan lebih banyak jenis unggas */}
            </select>
          </div>

          {/* Pilihan Fase */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Pilih Fase</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Starter</option>
              <option>Grower</option>
              <option>Finisher</option>
              <option>Layer</option>
              {/* Sesuaikan dengan data sebenarnya */}
            </select>
          </div>

          {/* Tabel Informasi Nutrisi */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Nutrisi</th>
                  <th className="p-2 border">Minimal (%)</th>
                  <th className="p-2 border">Maksimal (%)</th>
                </tr>
              </thead>
              <tbody>
                {/* Dummy Data */}
                <tr>
                  <td className="p-2 border">Protein Kasar</td>
                  <td className="p-2 border">21.0</td>
                  <td className="p-2 border">23.0</td>
                </tr>
                <tr>
                  <td className="p-2 border">Lemak Kasar</td>
                  <td className="p-2 border">3.0</td>
                  <td className="p-2 border">5.0</td>
                </tr>
                <tr>
                  <td className="p-2 border">Serat Kasar</td>
                  <td className="p-2 border">2.5</td>
                  <td className="p-2 border">4.0</td>
                </tr>
                {/* Nanti data akan diambil dari database */}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InformasiNutrisi;
