import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HasilFormulasiPage = () => {
  const hasil = [
    { nama: 'Jagung Giling', persentase: 30, harga: 2500 },
    { nama: 'Dedak Halus', persentase: 20, harga: 2000 },
    { nama: 'Bungkil Kedelai', persentase: 25, harga: 4000 },
    { nama: 'Tepung Ikan', persentase: 15, harga: 6000 },
    { nama: 'Premix', persentase: 10, harga: 5000 },
  ];

  const total = hasil.reduce((acc, item) => acc + (item.persentase * item.harga / 100), 0);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Hasil Formulasi Ransum</h2>
        <h3 className="text-2xl font-semibold mb-2">Detail Hasil Formulasi</h3>
        <p className="text-lg mb-6">
            Berikut adalah hasil formulasi pakan berdasarkan bahan pakan dan jenis unggas yang Anda pilih.
        </p>

        <table className="w-full border border-gray-300 mb-6 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Bahan Pakan</th>
              <th className="border px-4 py-2 text-left">Persentase (%)</th>
              <th className="border px-4 py-2 text-left">Harga (Rp/kg)</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.nama}</td>
                <td className="border px-4 py-2">{item.persentase}</td>
                <td className="border px-4 py-2">{item.harga.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-xl font-semibold mb-10">
          Total Biaya: Rp {total.toLocaleString()}/kg
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow">
            Unduh Hasil Formulasi
          </button>
          <a href="/formulasi" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow text-center">
            Formulasi Lagi
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HasilFormulasiPage;
