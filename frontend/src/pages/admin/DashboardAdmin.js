import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";

const DashboardAdmin = () => {
  return (
    <>
      <HeaderAdmin />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Bahan Pakan</h3>
            <p className="text-3xl font-bold text-blue-700">34</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Pengguna</h3>
            <p className="text-3xl font-bold text-blue-700">128</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Kebutuhan Nutrisi</h3>
            <p className="text-3xl font-bold text-blue-700">24</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Formulasi</h3>
            <p className="text-3xl font-bold text-blue-700">57</p>
          </div>
        </div>
      </main>
      <FooterAdmin />
    </>
  );
};

export default DashboardAdmin;
