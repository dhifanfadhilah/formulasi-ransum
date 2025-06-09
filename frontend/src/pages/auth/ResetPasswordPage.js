import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { resetPasswordConfirm } from '../services/auth';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Lemah';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return 'Kuat';
    }
    return 'Sedang';
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'new_password') {
      setPasswordStrength(getPasswordStrength(e.target.value));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (formData.new_password.length < 6) {
        toast.error("Password minimal 6 karakter.");
        setLoading(false);
        return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      await resetPasswordConfirm(uid, token, formData.new_password);
      toast.success("Password berhasil diubah. Silakan login.");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-gray-700">Password Baru</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan password baru"
                required
              />
              {formData.new_password && (
                <p className={`text-sm mt-1 ${
                  passwordStrength === "Kuat" ? "text-green-600" :
                  passwordStrength === "Sedang" ? "text-yellow-500" : "text-red-500"
                }`}>
                  Kekuatan sandi: {passwordStrength}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Konfirmasi Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ulangi password baru"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Memproses..." : "Atur Ulang Password"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
