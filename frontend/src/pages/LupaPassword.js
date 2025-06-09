import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { requestPasswordReset } from "./services/auth";

const LupaPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await requestPasswordReset(email);
      toast.success("Link reset password telah dikirim. Silakan cek email Anda.");
      setEmail(""); // reset form
    } catch (err) {
      const message = err?.response?.data?.email?.[0] || "Terjadi kesalahan.";
      toast.error(message);
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
            Lupa Password
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Masukkan email Anda untuk mengatur ulang password.
          </p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Kirim Instruksi Reset Password"}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/login" className="text-green-600 hover:underline text-sm">
              Kembali ke Login
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LupaPassword;
