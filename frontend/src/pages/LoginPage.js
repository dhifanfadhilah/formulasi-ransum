import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container mx-auto py-10 px-4 max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form className="bg-gray-50 p-6 rounded shadow space-y-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="********" />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-green-600" />
              Tetap login
            </label>
            <a href="/lupa-password" className="text-sm text-green-600 hover:underline">
              Lupa password?
            </a>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded shadow">
            Masuk
          </button>

          <p className="text-center text-sm mt-4">
            Belum punya akun?{' '}
            <a href="/daftar" className="text-green-600 hover:underline">Daftar sekarang</a>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
