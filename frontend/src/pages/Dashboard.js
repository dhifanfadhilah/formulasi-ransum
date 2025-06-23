import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchFormulasiList } from "./services/formulasiApi";
import { getUser } from "./services/tokenService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [formulasi, setFormulasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    const fetchData = async () => {
      try {
        const data = await fetchFormulasiList();
        setFormulasi(data);
      } catch (error) {
        toast.error("Gagal memuat formulasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Memuat...</div>;

  const totalFormulasi = formulasi.length;

  const sortedFormulasi = [...formulasi].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const formulasiTerakhir =
    formulasi.length > 0
      ? new Date(sortedFormulasi[0].created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Belum ada";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Dashboard Pengguna
          </h1>
          <p className="text-gray-700 mb-8">
            Selamat datang,{" "}
            <span className="font-semibold">{user?.name || "Pengguna"}</span>!
          </p>

          {/* Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Total Formulasi</h2>
              <p className="text-3xl font-bold text-indigo-600">
                {totalFormulasi}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Formulasi Terakhir</h2>
              <p className="text-gray-600">{formulasiTerakhir}</p>
            </div>
          </div>

          {/* Aksi */}
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              to="/formulasi"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-center"
            >
              + Buat Formulasi Baru
            </Link>
            <Link
              to="/riwayat-formulasi"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg text-center"
            >
              Lihat Formulasi Tersimpan
            </Link>
            <Link
              to="/profil"
              className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg text-center"
            >
              Edit Profil
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
