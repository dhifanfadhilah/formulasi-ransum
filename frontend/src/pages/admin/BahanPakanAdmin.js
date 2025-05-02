import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";

const BahanPakanAdmin = () => {
  const bahanPakan = [
    { id: 1, nama: "Jagung Kuning", harga: 4500, pk: 8.5, me: 3350 },
    { id: 2, nama: "Dedak Halus", harga: 3500, pk: 12.0, me: 2300 },
    { id: 3, nama: "Kedelai", harga: 8500, pk: 44.5, me: 2600 },
  ];

  return (
    <>
      <HeaderAdmin />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manajemen Bahan Pakan</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Tambah Bahan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Harga/kg</th>
                <th className="px-3 py-2 border">PK (%)</th>
                <th className="px-3 py-2 border">ME (kkal)</th>
                <th className="px-3 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bahanPakan.map((item, index) => (
                <tr key={item.id} className="text-center hover:bg-gray-100">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.nama}</td>
                  <td className="border px-3 py-2">Rp {item.harga}</td>
                  <td className="border px-3 py-2">{item.pk}</td>
                  <td className="border px-3 py-2">{item.me}</td>
                  <td className="border px-3 py-2 space-x-2">
                    <button className="text-sm text-white bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="text-sm text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700">
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

export default BahanPakanAdmin;
