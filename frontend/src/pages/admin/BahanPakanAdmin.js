import React, { useState, useEffect } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import {
  fetchBahanPakan,
  updateBahanPakan,
  deleteBahanPakan,
  createBahanPakan,
  fetchNutrien,
  fetchKandunganByBahan,
  createKandungan,
  updateKandungan,
} from "../services/adminApi";
import { toast } from "react-toastify";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    value
  );

const kategoriOptions = [
  { value: "", label: "Semua" },
  { value: "energi", label: "Sumber Energi" },
  { value: "protein", label: "Sumber Protein" },
  { value: "mineral", label: "Mineral & Prefix" },
];

const numericKeys = [
    "harga",
    "min_penggunaan",
    "max_penggunaan",
    "prioritas",
  ];

const sortList = (list, config) => {
  if (!config.key) return list;

  const { key, direction } = config;
  const dir = direction === "asc" ? 1 : -1;

  return [...list].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    // taruh data kosong di bawah
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    // jika kolom numerik, konversi ke angka dulu
    if (numericKeys.includes(key)) {
      valA = Number(valA);
      valB = Number(valB);
      return dir * (valA - valB);
    }

    // kalau bukan numerik → bandingkan string
    return (
      dir *
      valA
        .toString()
        .localeCompare(valB.toString(), "id-ID", { sensitivity: "base" })
    );
  });
};

const BahanPakanAdmin = () => {
  const [bahanList, setBahanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBahan, setSelectedBahan] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    kategori: "energi",
    min_penggunaan: "",
    max_penggunaan: "",
    prioritas: "",
  });
  const [nutrienList, setNutrienList] = useState([]);
  const [kandungan, setKandungan] = useState([]);

  const loadData = async () => {
    const data = await fetchBahanPakan();
    setBahanList(data);
  };

  const loadNutrien = async () => {
    const data = await fetchNutrien();
    setNutrienList(data);
  };

  useEffect(() => {
    loadData();
    loadNutrien();
  }, []);

  useEffect(() => {
    let filtered = bahanList.filter(
      (bahan) =>
        (!kategoriFilter || bahan.kategori === kategoriFilter) &&
        bahan.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered = sortList(filtered, sortConfig);
    setFilteredList(filtered);
  }, [bahanList, kategoriFilter, searchQuery, sortConfig]);

  const openModal = async (bahan = null) => {
    setSelectedBahan(bahan);
    if (bahan) {
      setFormData({ ...bahan });
      const kandunganData = await fetchKandunganByBahan(bahan.id);
      setKandungan(kandunganData);
    } else {
      setFormData({
        nama: "",
        harga: "",
        kategori: "energi",
        min_penggunaan: "",
        max_penggunaan: "",
        prioritas: "",
      });
      setKandungan([]);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      harga: parseFloat(formData.harga),
      min_penggunaan: formData.min_penggunaan
        ? parseFloat(formData.min_penggunaan)
        : null,
      max_penggunaan: formData.max_penggunaan
        ? parseFloat(formData.max_penggunaan)
        : null,
      prioritas: formData.prioritas ? parseInt(formData.prioritas) : null,
    };

    try {
      if (selectedBahan) {
        await updateBahanPakan(selectedBahan.id, payload);
        toast.success("Bahan pakan berhasil diperbarui");
      } else {
        await createBahanPakan(payload);
        toast.success("Bahan pakan berhasil ditambahkan");
      }
      setModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error("Gagal menyimpan bahan pakan");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Yakin ingin menghapus bahan pakan ini?")) {
        await deleteBahanPakan(id);
        toast.success("Bahan pakan berhasil dihapus");
        await loadData();
      }
    } catch (error) {
      toast.error("Gagal menghapus bahan pakan");
    }
  };

  const handleKandunganChange = (nutrienId, value) => {
    const updated = [...kandungan];
    const existing = updated.find((k) => k.nutrien.id === nutrienId);
    if (existing) {
      existing.nilai = value;
    } else {
      updated.push({
        nutrien: nutrienList.find((n) => n.id === nutrienId),
        nilai: value,
      });
    }
    setKandungan(updated);
  };

  const handleKandunganSave = async () => {
    try {
      for (let kand of kandungan) {
        if (kand.id) {
          await updateKandungan(kand.id, {
            nilai: kand.nilai,
            bahan_pakan: selectedBahan.id,
            nutrien: kand.nutrien.id,
          });
        } else {
          await createKandungan({
            nilai: kand.nilai,
            bahan_pakan: selectedBahan.id,
            nutrien: kand.nutrien.id,
          });
        }
      }
      toast.success("Kandungan nutrien berhasil disimpan");
      setModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error("Gagal menyimpan kandungan nutrien");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  return (
    <>
      <HeaderAdmin />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Manajemen Bahan Pakan</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            + Tambah Bahan
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {kategoriOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cari bahan pakan..."
            className="border px-3 py-2 rounded flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th
                  onClick={() => handleSort("nama")}
                  className="p-2 border cursor-pointer"
                >
                  Nama{" "}
                  {sortConfig.key === "nama" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("kategori")}
                  className="p-2 border cursor-pointer"
                >
                  Kategori{" "}
                  {sortConfig.key === "kategori" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("harga")}
                  className="p-2 border cursor-pointer"
                >
                  Harga{" "}
                  {sortConfig.key === "harga" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("min_penggunaan")}
                  className="p-2 border cursor=pointer"
                >
                  Min (%){" "}
                  {sortConfig.key === "min_penggunaan" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("max_penggunaan")}
                  className="p-2 border cursor-pointer"
                >
                  Max (%){" "}
                  {sortConfig.key === "max_penggunaan" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("prioritas")}
                  className="p-2 border cursor-pointer"
                >
                  Prioritas{" "}
                  {sortConfig.key === "prioritas" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((bahan) => (
                <tr key={bahan.id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{bahan.nama}</td>
                  <td className="border p-2 capitalize">{bahan.kategori}</td>
                  <td className="border p-2">{formatRupiah(bahan.harga)}</td>
                  <td className="border p-2">{bahan.min_penggunaan || "-"}</td>
                  <td className="border p-2">{bahan.max_penggunaan || "-"}</td>
                  <td className="border p-2">{bahan.prioritas || "-"}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => openModal(bahan)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bahan.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <FooterAdmin />

      {/* Modal Pop-Up */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-16 z-50">
          <div className="bg-white w-full max-w-3xl rounded shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selectedBahan ? "Edit Bahan Pakan" : "Tambah Bahan Pakan"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama"
                  className="border px-3 py-2 rounded"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Harga (Rp)"
                  className="border px-3 py-2 rounded"
                  value={formData.harga}
                  onChange={(e) =>
                    setFormData({ ...formData, harga: e.target.value })
                  }
                />
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                >
                  {kategoriOptions
                    .filter((k) => k.value)
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  placeholder="Prioritas"
                  className="border px-3 py-2 rounded"
                  value={formData.prioritas || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, prioritas: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Min Penggunaan (%)"
                  className="border px-3 py-2 rounded"
                  value={formData.min_penggunaan || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, min_penggunaan: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Max Penggunaan (%)"
                  className="border px-3 py-2 rounded"
                  value={formData.max_penggunaan || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, max_penggunaan: e.target.value })
                  }
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kandungan Nutrien (%)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nutrienList.map((nutrien) => {
                    const nilai =
                      kandungan.find((k) => k.nutrien.id === nutrien.id)
                        ?.nilai || "";
                    return (
                      <div key={nutrien.id} className="flex flex-col">
                        <label className="text-sm">{nutrien.nama}</label>
                        <input
                          type="number"
                          step="0.001"
                          value={nilai}
                          onChange={(e) =>
                            handleKandunganChange(nutrien.id, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Simpan Bahan
              </button>
              {selectedBahan && (
                <button
                  onClick={handleKandunganSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Simpan Nutrien
                </button>
              )}
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BahanPakanAdmin;
