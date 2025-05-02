import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";

const KebutuhanNutrisiAdmin = () => {
  const kebutuhan = [
    {
      id: 1,
      jenis: "Ayam Petelur",
      fase: "Layer (Produksi)",
      pk_min: 16.0,
      pk_max: 18.0,
      me_min: 2700,
      me_max: 2900,
    },
    {
      id: 2,
      jenis: "Ayam Broiler",
      fase: "Starter",
      pk_min: 21.0,
      pk_max: 23.0,
      me_min: 2800,
      me_max: 3000,
    },
  ];

  return (
    <>
      <HeaderAdmin />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manajemen Kebutuhan Nutrisi</h2>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
            Tambah Kebutuhan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Jenis Unggas</th>
                <th className="px-3 py-2 border">Fase</th>
                <th className="px-3 py-2 border">PK (%)</th>
                <th className="px-3 py-2 border">ME (kkal)</th>
                <th className="px-3 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kebutuhan.map((data, index) => (
                <tr key={data.id} className="text-center hover:bg-gray-100">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{data.jenis}</td>
                  <td className="border px-3 py-2">{data.fase}</td>
                  <td className="border px-3 py-2">
                    {data.pk_min} - {data.pk_max}
                  </td>
                  <td className="border px-3 py-2">
                    {data.me_min} - {data.me_max}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
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

export default KebutuhanNutrisiAdmin;
