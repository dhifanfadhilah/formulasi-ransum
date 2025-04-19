import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-full bg-white text-gray-800">
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">PakanUnggas</h1>
          <nav>
            <ul className="flex gap-4">
              <li><a href="/" className="hover:underline">Beranda</a></li>
              <li><a href="/formulasi" className="hover:underline">Formulasi</a></li>
              <li><a href="/informasi" className="hover:underline">Informasi Nutrisi</a></li>
              <li><a href="/login" className="hover:underline">Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">Selamat Datang di Sistem Formulasi Ransum Pakan Unggas</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Tentukan komposisi pakan ternak yang optimal dengan biaya yang minimal.
          </p>
          <a
            href="/formulasi"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-md transition"
          >
            Mulai Formulasi
          </a>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">💡 Edukatif</h3>
            <p>Digunakan untuk pembelajaran dan referensi mahasiswa atau peternak.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">⚖️ Akurat</h3>
            <p>Formulasi sesuai dengan standar nutrisi unggas berdasarkan SNI.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">📉 Ekonomis</h3>
            <p>Menghasilkan komposisi ransum dengan biaya paling rendah.</p>
          </div>
        </section>
      </main>

      <footer className="bg-green-700 text-white p-4 mt-16 text-center">
        <p>&copy; 2025 Sistem Formulasi Ransum Unggas</p>
      </footer>
    </div>
  );
};

export default HomePage;