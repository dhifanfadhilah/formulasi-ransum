import React, { useState, useEffect, useRef } from 'react';
import { getUser, clearTokens, clearUser } from '../pages/services/tokenService';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../pages/services/auth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();
  const profileRef = useRef();

  // Tutup dropdown saat klik di luar
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
    navigate('/login');
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">PakanUnggas</a>

        {/* Hamburger menu */}
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

        {/* Nav links */}
        <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent z-50 
                        md:flex items-center ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 py-2 md:p-0">
            <li><a href="/" className="hover:underline">Beranda</a></li>
            <li><a href="/formulasi" className="hover:underline">Formulasi</a></li>
            <li><a href="/informasi-nutrisi" className="hover:underline">Informasi Nutrisi</a></li>
            {!user ? (
              <li><a href="/login" className="hover:underline">Login</a></li>
            ) : (
              <li ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:underline"
                >
                  <span>{user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow animate-fade-in z-50">
                    <a href="/profil" className="block px-4 py-2 hover:bg-gray-100">Edit Profil</a>
                    <a href="/formulasi-saya" className="block px-4 py-2 hover:bg-gray-100">Formulasi Saya</a>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
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