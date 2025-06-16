import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-green-700 text-white py-6 px-4">
    <div className="container mx-auto text-center text-sm">
      <p className="mb-2">&copy; {new Date().getFullYear()} PakanUnggas. All rights reserved.</p>
      <div className="space-x-4">
        <Link to="/tentang" className="hover:underline">Tentang</Link>
        <Link to="/kontak" className="hover:underline">Kontak</Link>
        <Link to="/kebijakan" className="hover:underline">Privasi</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
