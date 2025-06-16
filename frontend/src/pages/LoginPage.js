import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './services/auth';
import { saveTokens, saveUser } from './services/tokenService';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', remember_me: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);

      saveTokens(data.access, data.refresh, formData.remember_me);
      saveUser({
        id: data.user_id,
        email: data.email,
        name: data.name,
        user_type: data.user_type,
      });

      navigate('/');
    } catch (err) {
      const msg = err?.error || 'Email atau password salah.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white text-gray-800">
      <Header />

      <main className="container mx-auto py-12 px-4 max-w-lg flex-grow">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-bold text-center text-green-700">Masuk ke Akun Anda</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="********"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember_me"
                  checked={formData.remember_me}
                  onChange={handleChange}
                  className="mr-2 accent-green-600"
                />
                Tetap login
              </label>
              <a href="/lupa-password" className="text-green-600 hover:underline">
                Lupa password?
              </a>
            </div>

            <button
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg shadow-md transition"
            >
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Belum punya akun?{' '}
              <a href="/daftar" className="text-green-600 hover:underline">
                Daftar sekarang
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
