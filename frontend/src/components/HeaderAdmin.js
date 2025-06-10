import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearTokens, clearUser } from "../pages/services/tokenService";
import { logoutUser } from "../pages/services/auth";

const HeaderAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    clearTokens();
    clearUser();
    navigate('/login');
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <a href="/">
            PakanUnggas
          </a> Admin
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <nav className={`space-x-4 md:static md:w-auto md:bg-transparent
                        md:flex ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 py-2 md:p-0 list-none">
            <li><Link to="/admin/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/admin/bahan-pakan" className="hover:underline">Bahan Pakan</Link></li>
            <li><Link to="/admin/pengguna" className="hover:underline">Pengguna</Link></li>
            <li><Link to="/admin/kebutuhan-nutrisi" className="hover:underline">Nutrisi</Link></li>
            <li><button onClick={handleLogout} className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdmin;
