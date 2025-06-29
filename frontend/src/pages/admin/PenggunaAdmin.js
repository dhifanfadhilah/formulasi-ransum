import React, { useState, useEffect } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import FooterAdmin from "../../components/FooterAdmin";
import {
  fetchAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../services/adminApi";
import { toast } from "react-toastify";
import SideBarAdmin from "./components/SideBarAdmin";

const PenggunaAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(prev => !prev);

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

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserByAdmin(id);
      fetchUsers();
      toast.success("Pengguna berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    } finally {
      setShowConfirmModal(false);
      setSelectedUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen relative">
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      <SideBarAdmin open={sidebarVisible} onClose={() => setSidebarVisible(false)}/>

      <div className="flex flex-col flex-1">
        <HeaderAdmin toggleSidebar={toggleSidebar}/>
        <main className="p-4 md:p-8 max-w-6xl mx-auto flex-grow">
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
                    <td className="border px-3 py-2">
                      {user.phone_number || "-"}
                    </td>
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
                        onClick={() =>
                          handleToggleActive(user.id, user.is_active)
                        }
                        className={`px-2 py-1 rounded text-white ${
                          user.is_active ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => confirmDelete(user.id)}
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

            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Konfirmasi Penghapusan
                  </h3>
                  <p className="mb-6 text-sm text-gray-600">
                    Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini
                    tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleDelete(selectedUserId)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default PenggunaAdmin;
