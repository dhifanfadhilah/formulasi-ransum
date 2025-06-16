import React, { useState, useEffect, useRef } from 'react';
import { getUser, clearTokens, clearUser, getAccessToken } from '../pages/services/tokenService';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../pages/services/auth';

const Header = () => {
  const [userData, setUserData] = useState(getUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    clearTokens();
    clearUser();
    setUserData(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-green-700 text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-xl font-bold tracking-wide">PakanUnggas</a>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Navigation */}
        <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent transition-all duration-200 
                        md:flex md:items-center ${menuOpen ? 'block' : 'hidden'} md:block z-40`}>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 py-2 md:p-0 text-sm font-medium">
            <li>
              <a href="/" className={`hover:underline ${isActive('/') && 'underline'}`}>Beranda</a>
            </li>
            <li>
              <a href="/formulasi" className={`hover:underline ${isActive('/formulasi') && 'underline'}`}>Formulasi</a>
            </li>
            <li>
              <a href="/informasi-nutrisi" className={`hover:underline ${isActive('/informasi-nutrisi') && 'underline'}`}>Informasi Nutrisi</a>
            </li>

            {!userData ? (
              <li>
                <a href="/login" className="hover:underline">Login</a>
              </li>
            ) : (
              <li ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 hover:underline focus:outline-none"
                >
                  <span>{userData.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-md overflow-hidden z-50 animate-fade-in text-sm">
                    {userData.user_type === 'admin' && (
                      <a href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Admin</a>
                    )}
                    <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
                    <a href="/profil" className="block px-4 py-2 hover:bg-gray-100">Edit Profil</a>
                    <a href="/riwayat-formulasi" className="block px-4 py-2 hover:bg-gray-100">Formulasi Saya</a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
