import React, { useState, useEffect } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import { fetchDashboardStats } from "../services/adminApi";
import GrafikBahanPakan from "./components/GrafikBahanPakan";
import SideBarAdmin from "./components/SideBarAdmin";

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition duration-300">
    <h4 className="text-gray-600 text-sm mb-2">{title}</h4>
    <p className="text-2xl font-bold text-green-700">{value}</p>
  </div>
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  useEffect(() => {
    document.title = "PakanUnggas - Dashboard Admin"; 
  }, []);

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

  if (loading) return <div className="p-6">Memuat data dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      <SideBarAdmin open={sidebarVisible} onClose={() => setSidebarVisible(false)}/>

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <main className="p-6 flex-1">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Dashboard Admin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Pengguna" value={stats.total_user} />
            <StatCard
              title="Total Bahan Pakan"
              value={stats.total_bahan_pakan}
            />
            <StatCard
              title="Total Kebutuhan Nutrien"
              value={stats.total_kebutuhan_nutrien}
            />
            <StatCard title="Total Formulasi" value={stats.total_formulasi} />
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Grafik Penggunaan Bahan Pakan
          </h2>
          <GrafikBahanPakan />
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default DashboardAdmin;
