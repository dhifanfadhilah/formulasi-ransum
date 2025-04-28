import Header from "../components/Header";
import Footer from "../components/Footer";

const LupaPassword = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
            Lupa Password
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Masukkan email atau nomor telepon Anda untuk mengatur ulang password.
          </p>
          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-gray-700">Email atau Nomor Telepon</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan email atau nomor telepon"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Kirim Instruksi Reset Password
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
