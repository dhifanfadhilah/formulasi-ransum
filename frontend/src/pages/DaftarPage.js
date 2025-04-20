import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const DaftarPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Nama Lengkap</label>
              <input type="text" className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Nama lengkap" />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Email" />
            </div>

            <div>
              <label className="block text-gray-700">Nomor Telepon</label>
              <input type="tel" className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="08xxxxxxxxxx" />
            </div>

            <div>
              <label className="block text-gray-700">Kata Sandi</label>
              <input type="password" className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Kata sandi" />
            </div>

            <div>
              <label className="block text-gray-700">Konfirmasi Kata Sandi</label>
              <input type="password" className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Ulangi kata sandi" />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition duration-300">
              Daftar
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DaftarPage;
