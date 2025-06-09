import React, { useState, useEffect} from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import { 
  fetchAllUsers, updateUserByAdmin, deleteUserByAdmin
} from "../services/adminApi";
import { toast } from "react-toastify";

const PenggunaAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserTypeChange = async (id, newType) => {
    try {
      await updateUserByAdmin(id, { user_type: newType });
      fetchUsers();
    } catch (error) {
      toast.error("Gagal mengubah tipe pengguna");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateUserByAdmin(id, { is_active: !currentStatus });
      fetchUsers();
    } catch (error) {
      toast.error("Gagal mengubah status aktif");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;
    try {
      await deleteUserByAdmin(id);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HeaderAdmin />
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="border px-3 py-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full border text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">No. Telepon</th>
                <th className="px-3 py-2 border">Tipe Akun</th>
                <th className="px-3 py-2 border">Aktif</th>
                <th className="px-3 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="text-center hover:bg-gray-100">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{user.name}</td>
                  <td className="border px-3 py-2">{user.email}</td>
                  <td className="border px-3 py-2">{user.phone_number || "-"}</td>
                  <td className="border px-3 py-2">
                    <select
                      value={user.user_type}
                      onChange={(e) =>
                        handleUserTypeChange(user.id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      className={`px-2 py-1 rounded text-white ${
                        user.is_active ? "bg-green-600" : "bg-gray-500"
                      }`}
                    >
                      {user.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Tidak ada data pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <FooterAdmin />
    </>
  );
};

export default PenggunaAdmin;