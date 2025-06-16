import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserProfile, changePassword, updateUserProfile } from './services/userApi';
import { getUser } from './services/tokenService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const user = getUser();
  const [profile, setProfile] = useState({ name: '', phone_number: '' });
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Lemah';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) return 'Kuat';
    return 'Sedang';
  };

  useEffect(() => {
    if (user) {
      getUserProfile(user.id)
        .then((data) => {
          setProfile({ name: data.name || '', phone_number: data.phone_number || '' });
          setOriginal(data);
        })
        .catch(() => toast.error('Gagal memuat data pengguna.'));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'new_password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await updateUserProfile(user.id, profile);
      toast.success('Profil berhasil diperbarui.');
    } catch (err) {
      setErrors(err.response?.data || {});
      toast.error('Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.new_password.length < 6) {
      setPasswordError('Password minimal 6 karakter.');
      return;
    }

    try {
      await changePassword(passwordForm);
      toast.success('Password berhasil diubah.');
      setPasswordForm({ old_password: '', new_password: '' });
      setPasswordStrength('');
    } catch (err) {
      const msg = err.response?.data || {};
      setPasswordError(msg.old_password?.[0] || msg.new_password?.[0] || 'Gagal mengganti password.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold mb-8 text-center">Pengaturan Profil</h1>

        {/* Form Profil */}
        <section className="bg-gray-50 p-6 rounded-xl shadow space-y-6">
          <h2 className="text-lg font-semibold">Informasi Pengguna</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={original.email || ''}
                  disabled
                  className="w-full p-2 border bg-gray-100 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. HP</label>
                <input
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                />
                {errors.phone_number && <p className="text-sm text-red-600 mt-1">{errors.phone_number}</p>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded shadow transition"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </section>

        {/* Form Password */}
        <section className="mt-10 bg-gray-50 p-6 rounded-xl shadow space-y-6">
          <h2 className="text-lg font-semibold">Ubah Password</h2>
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password Lama</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordForm.old_password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded"
                  required
                />
                {passwordForm.new_password && (
                  <p className={`text-sm mt-1 ${
                    passwordStrength === 'Kuat' ? 'text-green-600' :
                    passwordStrength === 'Sedang' ? 'text-yellow-500' :
                    'text-red-600'
                  }`}>
                    Kekuatan Sandi: {passwordStrength}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded shadow transition"
              >
                Simpan Password
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
