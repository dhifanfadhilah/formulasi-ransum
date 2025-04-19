import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FormulasiPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Formulasi Ransum Pakan</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-semibold">Jenis Unggas</label>
            <select className="w-full border border-gray-300 p-2 rounded">
              <option>Pilih jenis unggas</option>
              <option>Ayam Broiler</option>
              <option>Ayam Layer</option>
              <option>Ayam Petelur</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Fase Pemeliharaan</label>
            <select className="w-full border border-gray-300 p-2 rounded">
              <option>Pilih fase</option>
              <option>Starter</option>
              <option>Grower</option>
              <option>Finisher</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Sumber Energi</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(10)].map((_, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" />
                  Bahan Energi {i + 1}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Sumber Protein</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(14)].map((_, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" />
                  Bahan Protein {i + 1}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Mineral dan Premix</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(10)].map((_, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" />
                  Mineral {i + 1}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded shadow">
            Formulasikan Sekarang
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormulasiPage;
