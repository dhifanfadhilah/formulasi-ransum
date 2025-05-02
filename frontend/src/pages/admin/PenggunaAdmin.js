import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";

const PenggunaAdmin = () => {
  const pengguna = [
    { id: 1, nama: "Agus Peternak", email: "agus@example.com", no: "08123456789", type: "User" },
    { id: 2, nama: "Siti Admin", email: "siti@example.com", no: "08234567890", type: "Admin" },
  ];

  return (
    <>
      <HeaderAdmin />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">No. Telepon</th>
                <th className="px-3 py-2 border">Tipe Akun</th>
                <th className="px-3 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengguna.map((user, index) => (
                <tr key={user.id} className="text-center hover:bg-gray-100">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{user.nama}</td>
                  <td className="border px-3 py-2">{user.email}</td>
                  <td className="border px-3 py-2">{user.no}</td>
                  <td className="border px-3 py-2 capitalize">{user.type}</td>
                  <td className="border px-3 py-2 space-x-2">
                    <button className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Ubah Tipe
                    </button>
                    <button className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <FooterAdmin />
    </>
  );
};

export default PenggunaAdmin;
