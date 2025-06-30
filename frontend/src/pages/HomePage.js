import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  BookOpen,
  CheckCircle,
  Wallet,
  LogIn,
  Search,
  Calculator,
  Save,
} from "lucide-react";

const HomePage = () => {
  useEffect(() => {
    document.title = "PakanUnggas - Halaman Utama"; 
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />

      <main className="container mx-auto py-16 px-4">
        {/* Hero Section */}
        <section className="text-center bg-green-50 rounded-xl py-20 px-6 shadow-lg">
          <h1 className="text-5xl font-extrabold text-green-800 mb-4">
            Sistem Formulasi Ransum Pakan Ayam & Itik
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Gunakan sistem ini untuk menghitung komposisi pakan unggas secara
            cepat, akurat, dan ekonomis — tanpa perlu login!
          </p>
          <a
            href="/formulasi"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Mulai Formulasi
          </a>
          
        </section>

        {/* Keunggulan */}
        <section className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="w-10 h-10 text-green-600" />,
              title: "Edukatif",
              desc: "Bermanfaat bagi peternak, mahasiswa, dan penyuluh sebagai alat pembelajaran formulasi ransum.",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-green-600" />,
              title: "Akurat",
              desc: "Menggunakan standar kebutuhan nutrisi unggas dari SNI dan referensi terpercaya.",
            },
            {
              icon: <Wallet className="w-10 h-10 text-green-600" />,
              title: "Ekonomis",
              desc: "Menghitung ransum dengan biaya pakan paling efisien tanpa mengorbankan kualitas.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-full">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Langkah Penggunaan */}
        <section className="mt-24 py-20 px-6 bg-gradient-to-br from-green-100 to-white rounded-3xl shadow-inner">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
            Cara Menggunakan Sistem
          </h2>
          <div className="grid md:grid-cols-4 gap-10 text-center">
            {[
              {
                icon: <Search className="w-8 h-8 text-green-600" />,
                step: "1. Pilih Kebutuhan",
                desc: "Tentukan jenis unggas (ayam/itik) dan fase pemeliharaan.",
              },
              {
                icon: <Calculator className="w-8 h-8 text-green-600" />,
                step: "2. Formulasikan",
                desc: "Masukkan bahan pakan, sistem akan hitung formulasi optimal.",
              },
              {
                icon: <Save className="w-8 h-8 text-green-600" />,
                step: "3. Unduh Hasil",
                desc: "Anda dapat langsung melihat dan mengunduh hasil formulasi.",
              },
              {
                icon: <LogIn className="w-8 h-8 text-green-600" />,
                step: "4. Simpan (Opsional)",
                desc: "Login untuk menyimpan formulasi Anda dan mengaksesnya kembali nanti.",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="bg-white p-5 rounded-full shadow-md group-hover:shadow-lg transition">
                  {item.icon}
                </div>
                <h4 className="text-lg font-semibold text-green-800 mt-4">
                  {item.step}
                </h4>
                <p className="text-sm text-gray-700 mt-2 max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
