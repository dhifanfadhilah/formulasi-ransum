import React, { useState, useEffect, useRef } from "react";
import {
  getUser,
  clearTokens,
  clearUser,
  getAccessToken,
} from "../pages/services/tokenService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logoutUser } from "../pages/services/auth";
import { toast } from "react-toastify";

const Header = () => {
  const [userData, setUserData] = useState(getUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const access = getAccessToken();
    const user = getUser();
    if (!access || !user) {
      setUserData(null);
      clearUser();
      clearTokens();
    } else {
      setUserData(user);
    }
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    clearTokens();
    clearUser();
    setUserData(null);
    navigate("/");
    toast.success("Logout berhasil.");
  };

  const navItemClass = (path) =>
    `hover:text-green-300 transition ${
      location.pathname === path ? "text-white font-semibold underline" : "text-white"
    }`;

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          PakanUnggas
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={navItemClass("/")}>Beranda</Link>
          <Link to="/formulasi" className={navItemClass("/formulasi")}>Formulasi</Link>
          <Link to="/informasi-nutrisi" className={navItemClass("/informasi-nutrisi")}>Informasi Nutrisi</Link>

          {userData ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 hover:text-green-300"
              >
                <span>{userData.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-md text-sm z-50">
                  {userData.user_type === "admin" && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
                  )}
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profil" className="block px-4 py-2 hover:bg-gray-100">Edit Profil</Link>
                  <Link to="/riwayat-formulasi" className="block px-4 py-2 hover:bg-gray-100">Formulasi Saya</Link>
                  <button onClick={() => setShowLogoutModal(true)} className="w-full text-left px-4 py-2 hover:bg-red-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:underline text-white">Login</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-green-600 px-4 py-2 space-y-2 text-sm">
          <Link to="/" className="block" onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link to="/formulasi" className="block" onClick={() => setMenuOpen(false)}>Formulasi</Link>
          <Link to="/informasi-nutrisi" className="block" onClick={() => setMenuOpen(false)}>Informasi Nutrisi</Link>
          {!userData ? (
            <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Login</Link>
          ) : (
            <>
              {userData.user_type === "admin" && (
                <Link to="/admin/dashboard" className="block" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/dashboard" className="block" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profil" className="block" onClick={() => setMenuOpen(false)}>Edit Profil</Link>
              <Link to="/riwayat-formulasi" className="block" onClick={() => setMenuOpen(false)}>Formulasi Saya</Link>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-red-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 shadow-md w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Konfirmasi Logout</h2>
            <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Ya, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
