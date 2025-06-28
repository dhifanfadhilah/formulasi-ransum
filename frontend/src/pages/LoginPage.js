import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "./services/auth";
import { saveTokens, saveUser } from "./services/tokenService";
import { toast } from "react-toastify";
import { LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Check if google client ID is available
  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      console.error("REACT_APP_GOOGLE_CLIENT_ID is not defined");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log('Google credential response:', credentialResponse);
    setGoogleLoading(true);
    setError("");

    try {
      const data = await loginWithGoogle(credentialResponse.credential);

      const userData = {
        id: data.user_id || data.id,
        email: data.email,
        name: data.name,
        user_type: data.user_type || 'user',
      };

      saveTokens(data.access || data.access_token, data.refresh || data.refresh_token, true);
      saveUser(userData);

      toast.success("Login dengan Google berhasil.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Login Failed", err);
      const errorMsg = err?.response?.data?.error || err?.response?.data?.non_field_errors?.[0] || "Login dengan Google gagal.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Login dengan Google gagal.");
    toast.error("Login dengan Google gagal.");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ ...formData, email, password });

      saveTokens(data.access, data.refresh, formData.remember_me);
      saveUser({
        id: data.user_id,
        email: data.email,
        name: data.name,
        user_type: data.user_type,
      });

      toast.success("Login berhasil.");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Email atau password salah.";
      setError(msg);
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
            <h2 className="text-3xl font-bold text-center text-green-700">
              Masuk ke Akun Anda
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-600 text-center text-sm">
                {error}
              </div>
            )}

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
                disabled={loading || googleLoading}
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
                disabled={loading || googleLoading}
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
                  disabled={loading || googleLoading}
                />
                Tetap login
              </label>
              <Link
                to="/lupa-password"
                className="text-green-600 hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <button
              disabled={loading || googleLoading}
              type="submit"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg shadow-md transition"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>

            <div className="text-center text-gray-500 text-sm my-4">atau</div>

            <div className="flex justify-center">
              {googleLoading ? (
                <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses login Google...
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  locate="id"
                />
              )}  
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Belum punya akun?{" "}
              <Link to="/daftar" className="text-green-600 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
