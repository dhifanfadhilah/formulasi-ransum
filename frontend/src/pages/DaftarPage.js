import React, { useState, useEffect } from 'react';
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

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "PakanUnggas - Register"; 
  }, []);

  const validatePhoneNumber = (phone) => {
    const regex = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
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

    setErrors({ ...errors, [name]: null }); // Reset error saat mengetik
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { name, email, phone_number, password, confirmPassword } = formData;

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      phone_number: phone_number.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim()
    };

    const newErrors = {};
    if (!trimmed.name) newErrors.name = "Nama wajib diisi.";
    if (!/\S+@\S+\.\S+/.test(trimmed.email)) newErrors.email = "Format email tidak valid.";
    if (!validatePhoneNumber(trimmed.phone_number)) newErrors.phone_number = "Nomor telepon tidak valid.";
    if (trimmed.password.length < 6) newErrors.password = "Kata sandi minimal 6 karakter.";
    if (trimmed.password !== trimmed.confirmPassword) newErrors.confirmPassword = "Konfirmasi sandi tidak cocok.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        name: trimmed.name,
        email: trimmed.email,
        phone_number: trimmed.phone_number,
        password: trimmed.password
      });

      toast.success("Registrasi berhasil! Silakan cek email Anda.");

      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: ''
      });

      setPasswordStrength('');
      setErrors({});
    } catch (err) {
      console.error("Struktur error lengkap:", err);
      if (typeof err === 'object' && err !== null && Object.keys(err).length > 0) {
        const errorKey = Object.keys(err)[0];
        const errorMessages = err[errorKey];

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          toast.error(errorMessages[0]); // <-- Ini akan menampilkan "Email sudah terdaftar"
        } else {
          // Fallback untuk format yang tidak terduga
          toast.error("Terjadi kesalahan validasi.");
        }
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
            {['name', 'email', 'phone_number'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('_', ' ')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition ${
                    errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                  }`}
                  placeholder={field === 'phone_number' ? '08xxxxxxxxxx' : `Masukkan ${field}`}
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                  }`}
                  placeholder="Kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-sm text-gray-600"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              {passwordStrength && (
                <p className={`text-sm mt-1 ${
                  passwordStrength === "Kuat" ? "text-green-600" :
                  passwordStrength === "Sedang" ? "text-yellow-500" :
                  "text-red-500"
                }`}>
                  Kekuatan sandi: {passwordStrength}
                </p>
              )}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                }`}
                placeholder="Ulangi kata sandi"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
