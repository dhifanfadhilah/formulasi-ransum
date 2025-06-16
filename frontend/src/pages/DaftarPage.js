import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { registerUser } from './services/auth';
import { toast } from 'react-toastify';

const DaftarPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phone) => {
    const regex = /^08[1-9][0-9]{7,10}$/;
    return regex.test(phone);
  };

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Lemah';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return 'Kuat';
    }
    return 'Sedang';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { name, email, phone_number, password, confirmPassword } = formData;

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Format email tidak valid.");
      return;
    }

    if (!validatePhoneNumber(phone_number)) {
      toast.error("Nomor telepon tidak valid.");
      return;
    }

    if (password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ name, email, phone_number, password });
      toast.success("Registrasi berhasil! Silakan cek email Anda.");
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: ''
      });
      setPasswordStrength('');
    } catch (err) {
      if (err && typeof err === 'object') {
        const errors = Object.values(err).flat();
        toast.error(errors.join(', '));
      } else {
        toast.error("Registrasi gagal.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-2">Daftar Akun Baru</h2>
          <p className="text-sm text-center text-gray-600 mb-6">Silakan isi form berikut untuk membuat akun</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
                placeholder="Kata sandi"
              />
              {formData.password && (
                <p className={`text-sm mt-1 ${
                  passwordStrength === "Kuat" ? "text-green-600" :
                  passwordStrength === "Sedang" ? "text-yellow-500" :
                  "text-red-500"
                }`}>
                  Kekuatan sandi: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
                placeholder="Ulangi kata sandi"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
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
