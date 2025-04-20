import React from 'react';

const Header = () => (
  <header className="bg-green-700 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <a href="/"><h1 className="text-2xl font-bold">PakanUnggas</h1></a>
      <nav>
        <ul className="flex gap-4">
          <li><a href="/" className="hover:underline">Beranda</a></li>
          <li><a href="/formulasi" className="hover:underline">Formulasi</a></li>
          <li><a href="/nutrisi" className="hover:underline">Informasi Nutrisi</a></li>
          <li><a href="/login" className="hover:underline">Login</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;