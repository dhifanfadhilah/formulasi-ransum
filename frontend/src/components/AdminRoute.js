import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../pages/services/tokenService';

const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
