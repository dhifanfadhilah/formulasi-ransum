import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import {
  fetchJenisUnggas,
  fetchFaseByJenisUnggas,
  fetchKebutuhanNutrien,
} from "./services/userApi";

const InformasiNutrisi = () => {
  const [jenisList, setJenisList] = useState([]);
  const [faseList, setFaseList] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [selectedFase, setSelectedFase] = useState(null);
  const [nutrisiList, setNutrisiList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "PakanUnggas - Informasi Nutrisi"; 
  }, []);

  useEffect(() => {
    const loadJenisUnggas = async () => {
      const jenis = await fetchJenisUnggas();
      setJenisList(jenis);
      const defaultJenis =
        jenis.find((j) => j.nama.toLowerCase().includes("pedaging")) || jenis[0];
      setSelectedJenis(defaultJenis);
    };
    loadJenisUnggas();
  }, []);

  useEffect(() => {
    if (selectedJenis) {
      const loadFase = async () => {
        const fase = await fetchFaseByJenisUnggas(selectedJenis.id);
        setFaseList(fase);
        const defaultFase =
          fase.find((f) => f.fase_nama.toLowerCase().includes("starter")) || fase[0];
        setSelectedFase(defaultFase);
      };
      loadFase();
    }
  }, [selectedJenis]);

  useEffect(() => {
    if (selectedJenis && selectedFase) {
      const loadKebutuhanNutrien = async () => {
        setIsLoading(true);
        try {
          const data = await fetchKebutuhanNutrien(
            selectedJenis.id,
            selectedFase.fase
          );
          setTimeout(() => {
            setNutrisiList(data);
            setIsLoading(false);
          }, 300);
        } catch (err) {
          console.error("Gagal memuat data nutrisi", err);
          setNutrisiList([]);
          setIsLoading(false);
        }
      };
      loadKebutuhanNutrien();
    }
  }, [selectedJenis, selectedFase]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Informasi Kebutuhan Nutrisi Unggas
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Filter Panel */}
          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Jenis Unggas</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedJenis?.id || ""}
                onChange={(e) => {
                  const jenis = jenisList.find(
                    (j) => j.id === parseInt(e.target.value)
                  );
                  setSelectedFase(null);
                  setSelectedJenis(jenis);
                }}
              >
                {jenisList.map((jenis) => (
                  <option key={jenis.id} value={jenis.id} className="capitalize">
                    {jenis.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fase</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedFase?.fase || ""}
                onChange={(e) => {
                  const fase = faseList.find(
                    (f) => f.fase === parseInt(e.target.value)
                  );
                  setSelectedFase(fase);
                }}
              >
                {faseList.map((fase) => (
                  <option key={fase.fase} value={fase.fase}>
                    {fase.fase_nama.charAt(0).toUpperCase() + fase.fase_nama.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabel Nutrisi */}
          <div className="overflow-x-auto bg-white shadow border rounded-xl">
            <table className="w-full text-base">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left">Nutrisi</th>
                  <th className="p-3 text-right">Minimal</th>
                  <th className="p-3 text-right">Maksimal</th>
                  <th className="p-3 text-center">Satuan</th>
                </tr>
              </thead>
              <tbody className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6">
                      <div className="flex justify-center items-center gap-2 text-gray-500">
                        <svg
                          className="w-5 h-5 animate-spin text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                          />
                        </svg>
                        Memuat data nutrisi...
                      </div>
                    </td>
                  </tr>
                ) : nutrisiList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  nutrisiList
                    .sort((a, b) => (b.min_value ?? 0) - (a.min_value ?? 0)) // Sort by min_value desc
                    .map((item, i) => (
                      <tr key={i} className="even:bg-gray-50 hover:bg-green-50 transition">
                        <td className="p-3 border-t">{item.nutrien.nama}</td>
                        <td className="p-3 border-t text-right">
                          {item.min_value ?? "-"}
                        </td>
                        <td className="p-3 border-t text-right">
                          {item.max_value ?? "-"}
                        </td>
                        <td className="p-3 border-t text-center">
                          {item.nutrien.satuan}
                        </td>
                      </tr>
                    ))
                )}
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
