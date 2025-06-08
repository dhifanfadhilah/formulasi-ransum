import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  fetchJenisUnggas, fetchBahanPakan, fetchFaseByJenisUnggas,
  fetchBahanPakanByKategori,
  postFormulasi,
} from './services/userApi';

const FormulasiPage = () => {
  const [jenisUnggas, setJenisUnggas] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState('');
  const [faseUnggas, setFaseUnggas] = useState([]);
  const [selectedFase, setSelectedFase] = useState('');
  const [bahanPakan, setBahanPakan] = useState([]);
  const [sumberEnergi, setSumberEnergi] = useState([]);
  const [sumberProtein, setSumberProtein] = useState([]);
  const [mineralPrefix, setMineralPrefix] = useState([]);
  const [selectedBahanPakan, setSelectedBahanPakan] = useState([]);

  const handleCheckboxChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedBahanPakan((prev) =>
      e.target.checked
        ? [...prev, id]
        : prev.filter((val) => val !== id)
    );
  }

  const handleFormulasi = async () => {
    if(!selectedJenis || !selectedFase || selectedBahanPakan.length === 0){
      alert("Mohon Lengkapi semua pilihan sebelum melakukan formulasi.");
      return;
    }

    if (selectedBahanPakan.length < 3) {
      alert("Pilihan bahan pakan tidak boleh kurang dari 3.");
      return;
    }

    const payload = {
      jenis_unggas: parseInt(selectedJenis),
      fase: parseInt(selectedFase),
      bahan_pakan_ids: selectedBahanPakan
    };

    try {
      const result = await postFormulasi(payload);
      console.log('Hasil Formulasi:', result);
      alert("Formulasi berhasil dilakukan.");
    } catch (error) {
      console.error('Gagal melakukan formulasi:', error);
      alert('Terjadi kesalahan saat formulasi.')
    }

    console.log(payload);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [jenis, bahan] = await Promise.all([
          fetchJenisUnggas(),
          fetchBahanPakan()
        ]);
        setJenisUnggas(jenis);
        setBahanPakan(bahan);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      }
    }
    
    loadData();
  }, []);

  useEffect(() => {
    async function loadFase() {
      if (!selectedJenis) {
        setFaseUnggas([]);
        return;
      }

      try {
        const data = await fetchFaseByJenisUnggas(selectedJenis);
        const faseList = data.map(item => ({
          id: item.fase,
          nama: item.fase_nama
        }));
        setFaseUnggas(faseList);
      } catch (error) {
        console.error('Gagal memuat fase unggas:', error);
      }
    }

    loadFase();
  }, [selectedJenis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [energi, protein, mineral] = await Promise.all([
          fetchBahanPakanByKategori('energi'),
          fetchBahanPakanByKategori('protein'),
          fetchBahanPakanByKategori('mineral'),
        ]);
        setSumberEnergi(energi);
        setSumberProtein(protein);
        setMineralPrefix(mineral);
      } catch (error) {
        console.error('Gagal memuat data bahan pakan per kategori:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Formulasi Ransum Pakan</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-semibold">Jenis Unggas</label>
            <select 
              className="w-full border border-gray-300 p-2 rounded"
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
            >
              <option value="">Pilih jenis unggas</option>
              {jenisUnggas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Fase Pemeliharaan</label>
            <select 
              className="w-full border border-gray-300 p-2 rounded"
              value={selectedFase}
              onChange={(e) => setSelectedFase(e.target.value)}
            >
              <option value="">Pilih fase</option>
              {faseUnggas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama.charAt(0).toUpperCase() + item.nama.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Sumber Energi</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sumberEnergi.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="accent-green-600"
                    value={item.id}
                    onChange={handleCheckboxChange}
                  />
                  {item.nama}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Sumber Protein</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sumberProtein.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="accent-green-600" 
                    value={item.id}
                    onChange={handleCheckboxChange}
                  />
                  {item.nama}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Mineral dan Premix</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {mineralPrefix.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="accent-green-600"
                    value={item.id}
                    onChange={handleCheckboxChange}
                  />
                  {item.nama}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded shadow"
            onClick={handleFormulasi}
          >
            Formulasi
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormulasiPage;
