import React, { useState, useEffect} from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import { fetchDashboardStats } from "../services/adminApi";

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
    <h4 className="text-gray-600 text-sm mb-2">{title}</h4>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin />
      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Pengguna" value={stats.total_user} />
          <StatCard title="Total Bahan Pakan" value={stats.total_bahan_pakan} />
          <StatCard title="Total Kebutuhan Nutrien" value={stats.total_kebutuhan_nutrien} />
          <StatCard title="Total Formulasi" value={stats.total_formulasi} />
        </div>
      </div>
      <FooterAdmin />
    </div>
  );
};

export default DashboardAdmin;
