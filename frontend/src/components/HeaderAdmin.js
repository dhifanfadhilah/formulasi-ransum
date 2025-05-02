import React from "react";
import { Link } from "react-router-dom";

const HeaderAdmin = () => {
  return (
    <header className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">PakanUnggas Admin</h1>
      <nav className="space-x-4">
        <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/admin/bahan-pakan" className="hover:underline">Bahan Pakan</Link>
        <Link to="/admin/pengguna" className="hover:underline">Pengguna</Link>
        <Link to="/admin/kebutuhan-nutrisi" className="hover:underline">Nutrisi</Link>
        <button className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
