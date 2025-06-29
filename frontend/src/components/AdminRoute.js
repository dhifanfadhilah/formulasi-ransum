import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../pages/services/tokenService';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type !== "admin") {
    toast.error("Akses ditolak.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
