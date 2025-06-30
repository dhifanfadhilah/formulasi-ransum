import { useNavigate } from "react-router-dom";
import { logoutUser } from "../pages/services/auth";
import { clearTokens, clearUser } from "../pages/services/tokenService";
import { Menu } from "lucide-react";
import { useState } from "react";

const HeaderAdmin = ({ toggleSidebar }) => {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    clearTokens();
    clearUser();
    navigate("/login");
  };

  return (
    <header className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold">PakanUnggas Admin</h1>
      </div>
      <button
        onClick={() => setLogoutConfirmOpen(true)}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>

      {logoutConfirmOpen && (
        <div className="text-black fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Konfirmasi Logout
            </h2>
            <p className="text-center mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderAdmin;
