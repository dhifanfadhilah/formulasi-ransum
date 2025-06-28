import React, { useState, useEffect, useRef } from 'react';
import { getUser, clearTokens, clearUser, getAccessToken } from '../pages/services/tokenService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutUser } from '../pages/services/auth';
import { toast } from 'react-toastify';

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

    setMenuOpen(false); // Menutup menu saat route berpindah
    setProfileOpen(false); // Menutup dropdown profile saat pindah halaman
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
    try {
      await logoutUser();
    } catch (err) {
      // Optional: log error
    }
    clearTokens();
    clearUser();
    setUserData(null);
    navigate('/');
    toast.success('Logout berhasil.');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-green-700 text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">PakanUnggas</Link>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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
              <Link to="/" className={`hover:underline ${isActive('/') ? 'underline' : ''}`}>Beranda</Link>
            </li>
            <li>
              <Link to="/formulasi" className={`hover:underline ${isActive('/formulasi') ? 'underline' : ''}`}>Formulasi</Link>
            </li>
            <li>
              <Link to="/informasi-nutrisi" className={`hover:underline ${isActive('/informasi-nutrisi') ? 'underline' : ''}`}>Informasi Nutrisi</Link>
            </li>

            {!userData ? (
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
            ) : (
              <li ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 hover:underline focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  aria-label="Toggle profile menu"
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
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-md overflow-hidden z-50 animate-fade-in text-sm transition-all duration-150">
                    {userData.user_type === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
                    )}
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/profil" className="block px-4 py-2 hover:bg-gray-100">Edit Profil</Link>
                    <Link to="/riwayat-formulasi" className="block px-4 py-2 hover:bg-gray-100">Formulasi Saya</Link>
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
