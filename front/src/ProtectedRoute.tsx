import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./api/context/AuthContext";

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
