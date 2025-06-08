import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { registerUser } from './services/auth';

const DaftarPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phone) => {
    const regex = /^08[1-9][0-9]{7,10}$/;
    return regex.test(phone);
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Lemah';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return 'Kuat';
    }
    return 'Sedang';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
    setError(null);

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid.");
      return;
    }

    if (!validatePhoneNumber(formData.phone_number)) {
      setError("Nomor telepon tidak valid.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      });
      setSuccessMessage("Registrasi berhasil! Silakan cek email untuk verifikasi.");
      setFormData({ name: '', email: '', phone_number: '', password: '', confirmPassword: '' });
      setPasswordStrength('');
    } catch (err) {
      if (err && typeof err === 'object') {
        const errors = Object.values(err).flat();
        setError(errors.join(', '));
      } else {
        setError("Registrasi gagal.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h2>

          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
          {successMessage && <div className="text-green-600 mb-4 text-center">{successMessage}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Nama Lengkap</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Nama lengkap" />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="Email" />
            </div>

            <div>
              <label className="block text-gray-700">Nomor Telepon</label>
              <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2 mt-1" placeholder="08xxxxxxxxxx" />
            </div>

            <div>
              <label className="block text-gray-700">Kata Sandi</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-2 mt-1"
                placeholder="Kata sandi"
              />
              {formData.password && (
                <p className={`text-sm mt-1 ${
                  passwordStrength === "Kuat" ? "text-green-600" :
                  passwordStrength === "Sedang" ? "text-yellow-500" : "text-red-500"
                }`}>
                  Kekuatan sandi: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-2 mt-1"
                placeholder="Ulangi kata sandi"
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition duration-300">
              {isLoading ? 'Memproses...' : 'Daftar'}
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
