import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  fetchJenisUnggas,
  fetchBahanPakan,
  fetchFaseByJenisUnggas,
  fetchBahanPakanByKategori,
} from "./services/userApi";
import { postFormulasi } from "./services/formulasiApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormulasiPage = () => {
  const [jenisUnggas, setJenisUnggas] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [faseUnggas, setFaseUnggas] = useState([]);
  const [selectedFase, setSelectedFase] = useState("");
  const [bahanPakan, setBahanPakan] = useState([]);
  const [sumberEnergi, setSumberEnergi] = useState([]);
  const [sumberProtein, setSumberProtein] = useState([]);
  const [mineralPrefix, setMineralPrefix] = useState([]);
  const [selectedBahanPakan, setSelectedBahanPakan] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PakanUnggas - Formulasi";
  }, []);

  const handleCheckboxChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedBahanPakan((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((val) => val !== id)
    );
  };

  const validateKategoriTerpenuhi = () => {
    const energiIds = sumberEnergi.map((item) => item.id);
    const proteinIds = sumberProtein.map((item) => item.id);
    const mineralIds = mineralPrefix.map((item) => item.id);

    const hasEnergi = selectedBahanPakan.some((id) => energiIds.includes(id));
    const hasProtein = selectedBahanPakan.some((id) => proteinIds.includes(id));
    const hasMineral = selectedBahanPakan.some((id) => mineralIds.includes(id));

    return hasEnergi && hasProtein && hasMineral;
  };

  const handleFormulasi = async () => {
    if (!selectedJenis || !selectedFase || selectedBahanPakan.length === 0) {
      toast.error("Mohon Lengkapi semua pilihan sebelum melakukan formulasi.");
      return;
    }

    if (!validateKategoriTerpenuhi()) {
      toast.error("Pilihan bahan pakan harus memenuhi kategori energi, protein, dan mineral.");
      return;
    }

    if (selectedBahanPakan.length < 3) {
      toast.error("Pilihan bahan pakan tidak boleh kurang dari 3.");
      return;
    }

    const payload = {
      jenis_unggas: parseInt(selectedJenis),
      fase: parseInt(selectedFase),
      bahan_pakan_ids: selectedBahanPakan,
    };
    setLoading(true);

    try {
      const result = await postFormulasi(payload);
      navigate("/hasil-formulasi", { state: { hasilFormulasi: result } });
    } catch (error) {
      console.error("Gagal melakukan formulasi:", error);
      toast.error("Tidak dapat menemukan solusi formulasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [jenis, bahan] = await Promise.all([
          fetchJenisUnggas(),
          fetchBahanPakan(),
        ]);
        setJenisUnggas(jenis);
        setBahanPakan(bahan);
      } catch (error) {
        console.error("Gagal memuat data:", error);
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
        const faseList = data.map((item) => ({
          id: item.fase,
          nama: item.fase_nama,
        }));
        setFaseUnggas(faseList);
      } catch (error) {
        console.error("Gagal memuat fase unggas:", error);
      }
    }

    loadFase();
  }, [selectedJenis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [energi, protein, mineral] = await Promise.all([
          fetchBahanPakanByKategori("energi"),
          fetchBahanPakanByKategori("protein"),
          fetchBahanPakanByKategori("mineral"),
        ]);
        setSumberEnergi(energi);
        setSumberProtein(protein);
        setMineralPrefix(mineral);
      } catch (error) {
        console.error("Gagal memuat data bahan pakan per kategori:", error);
      }
    };

    fetchData();
  }, []);

  const getSelectedBahanByKategori = (kategoriList) => {
    return kategoriList.filter((item) => selectedBahanPakan.includes(item.id));
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container max-w-5xl mx-auto py-12 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
            Formulasi Ransum Pakan
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Jenis Unggas
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <label className="block mb-2 font-medium text-gray-700">
                Fase Pemeliharaan
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {[{ title: "Sumber Energi", data: sumberEnergi }, { title: "Sumber Protein", data: sumberProtein }, { title: "Mineral dan Premix", data: mineralPrefix }].map((kategori, idx) => {
            const selectedCount = kategori.data.filter((item) => selectedBahanPakan.includes(item.id)).length;
            return (
              <details key={idx} className="mb-6 border rounded-lg shadow-sm">
                <summary className="cursor-pointer text-lg font-semibold p-3 bg-green-50 rounded-t-lg text-green-700">
                  {kategori.title} ({selectedCount} dipilih)
                </summary>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {kategori.data.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-green-50"
                    >
                      <input
                        type="checkbox"
                        value={item.id}
                        onChange={handleCheckboxChange}
                        checked={selectedBahanPakan.includes(item.id)}
                        className="accent-green-600 w-4 h-4"
                      />
                      <span className="truncate text-sm">{item.nama}</span>
                    </label>
                  ))}
                </div>
              </details>
            );
          })}

          {/* Preview Bahan Terpilih */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-6 text-green-700">
              Preview Bahan Terpilih
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[{ label: "Sumber Energi", list: getSelectedBahanByKategori(sumberEnergi) }, { label: "Sumber Protein", list: getSelectedBahanByKategori(sumberProtein) }, { label: "Mineral dan Premix", list: getSelectedBahanByKategori(mineralPrefix) }].map((kategori, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm border">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    {kategori.label}
                  </h4>
                  {kategori.list.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-800 space-y-1">
                      {kategori.list.map((item) => (
                        <li key={item.id}>{item.nama}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada bahan dipilih</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={handleFormulasi}
              disabled={loading}
              className={`px-10 py-4 text-lg font-semibold rounded-full transition-all duration-200 ${
                loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white shadow-lg`}
            >
              {loading ? "Memproses..." : "Formulasikan Ransum"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormulasiPage;
