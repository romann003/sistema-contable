import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./api/context/AuthContext";

//? ----------- ProtectedRoute
export function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  if (!loading && !isAuthenticated) return <Navigate to="/access-denied" replace />;
  return <Outlet />;
}

//? ----------- isSuperAdmin
export function ProtectedRouteOnlySuperAdmin() {
  const { user } = useAuth();
  if (user?.rol === 'root') { return <Outlet /> }
  else if (user?.rol === 'administrador' || user?.rol === 'moderador') { return <Navigate to="/access-denied" replace />; }
}

//? ----------- isAdmins
export function ProtectedRouteOnlyAdmins() {
  const { user } = useAuth();
  if (user?.rol === 'root' && user?.rol === 'administrador') { return <Outlet /> }
  else if (user?.rol === 'moderador') { return <Navigate to="/access-denied" replace />; }
  return <Outlet />
}