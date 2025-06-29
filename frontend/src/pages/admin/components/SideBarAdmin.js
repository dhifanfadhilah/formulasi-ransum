import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

const SideBarAdmin = ({ open, onClose }) => {
  const navItemStyle = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
    }`;

  return (
    <aside
      className={`bg-blue-900 text-white w-64 min-h-screen p-4 fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out 
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Menu Admin</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none"
          aria-label="Tutup Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={navItemStyle}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/admin/bahan-pakan" className={navItemStyle}>
          🌾 Bahan Pakan
        </NavLink>
        <NavLink to="/admin/pengguna" className={navItemStyle}>
          👤 Pengguna
        </NavLink>
        <NavLink to="/admin/kebutuhan-nutrisi" className={navItemStyle}>
          🥗 Nutrisi
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBarAdmin;