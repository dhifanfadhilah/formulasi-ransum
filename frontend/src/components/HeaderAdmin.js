import { useNavigate } from "react-router-dom";
import { logoutUser } from "../pages/services/auth";
import { clearTokens, clearUser } from "../pages/services/tokenService";
import { Menu } from "lucide-react";

const HeaderAdmin = ({ toggleSidebar }) => {
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
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold">PakanUnggas Admin</h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default HeaderAdmin;