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
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'Lemah';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return 'Kuat';
    }
    return 'Sedang';
  };

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then((data) => {
        setProfile({ name: data.name || '', phone_number: data.phone_number || '' });
        setOriginal(data);
      })
      .catch(() => {
        toast.error('Gagal memuat data pengguna.');
      });
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
    setMessage('');
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
    setPasswordMessage('');

    if (passwordForm.new_password < 6) {
      setPasswordMessage('Password minimal 6 karakter.');
      return;
    }

    try {
      await changePassword(passwordForm);
      toast.success('Password berhasil diubah.');
      setPasswordForm({ old_password: '', new_password: '' });
    } catch (err) {
      const msg = err.response?.data || {};
      toast.error(msg.old_password?.[0] || msg.new_password?.[0] || 'Gagal mengganti password.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-10 space-y-10">
        <section className="bg-gray-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profil Pengguna</h2>
          {message && <p className="text-green-600 mb-2">{message}</p>}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={original.email}
                disabled
                className="w-full p-2 border bg-gray-100 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nama</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-semibold mb-1">No. HP</label>
              <input
                name="phone_number"
                value={profile.phone_number}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded"
              />
              {errors.phone_number && <p className="text-red-600 text-sm">{errors.phone_number}</p>}
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </section>

        <section className="bg-gray-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Ubah Password</h2>
          {passwordMessage && (
            <p className={passwordMessage.includes('berhasil') ? 'text-green-600' : 'text-red-600'}>
              {passwordMessage}
            </p>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Password Lama</label>
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
              <label className="block font-semibold mb-1">Password Baru</label>
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
                  passwordStrength === "Kuat" ? "text-green-600" :
                  passwordStrength === "Sedang" ? "text-yellow-500" : "text-red-500"
                }`}>
                  Kekuatan sandi: {passwordStrength}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700"
            >
              Simpan Password
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
