import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../pages/services/tokenService";

const ProtectedRoute = () => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;