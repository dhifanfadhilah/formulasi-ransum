import React, {useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './services/auth';
import { saveTokens, saveUser } from './services/tokenService';

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

      navigate('/'); // atau dashboard
    } catch (err) {
      const msg = err?.error || 'Email atau password salah.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container mx-auto py-10 px-4 max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow space-y-4">
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded" 
              placeholder="email@example.com" 
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded" 
              placeholder="********" 
              required
            />
          </div>

          <div className="flex items-center justify-between">
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
            <a href="/lupa-password" className="text-sm text-green-600 hover:underline">
              Lupa password?
            </a>
          </div>

          <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded shadow">
            {loading ? 'Memproses...' : 'Masuk'}
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
