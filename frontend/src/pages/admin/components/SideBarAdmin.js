import React from "react";
import { NavLink } from "react-router-dom";
import { X, Home, BarChart2, Users, Leaf, Sliders } from "lucide-react";

const SideBarAdmin = ({ open, onClose }) => {
  const navItems = [
    { to: "/admin/dashboard", icon: <BarChart2 size={18} />, label: "Dashboard" },
    { to: "/admin/bahan-pakan", icon: <Leaf size={18} />, label: "Bahan Pakan" },
    { to: "/admin/pengguna", icon: <Users size={18} />, label: "Pengguna" },
    { to: "/admin/kebutuhan-nutrisi", icon: <Sliders size={18} />, label: "Nutrisi" },
  ];

  return (
    <aside
      className={`bg-white shadow-xl text-gray-800 w-64 min-h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-700">Admin Panel</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Tutup Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-4 py-6">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-6">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition w-full"
        >
          <Home size={16} />
          Beranda
        </NavLink>
      </div>
    </aside>
  );
};

export default SideBarAdmin;
