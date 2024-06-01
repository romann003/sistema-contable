import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./api/context/AuthContext";

//? ----------- ProtectedRoute
export function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  if (!loading && !isAuthenticated) return <Navigate to="/access-denied" replace/>;
  return <Outlet />;
}

//? ----------- isSuperAdmin
export function ProtectedRouteOnlySuperAdmin() {
  const { loading, isAuthenticated, user } = useAuth();
  if (!loading && !isAuthenticated) return <Navigate to="/access-denied" replace/>;
  if (user?.rol !== 'root') return <Navigate to="/access-denied" replace/>;
  return <Outlet />;
}

//? ----------- isAdmins
export function ProtectedRouteOnlyAdmins() {
  const { loading, isAuthenticated, user } = useAuth();
  if (!loading && !isAuthenticated) return <Navigate to="/access-denied" replace/>;
  if (user?.rol !== 'root' && user?.rol !== 'administrador') return <Navigate to="/access-denied" replace/>;
  return <Outlet />;
}

//? ----------- isUsers
export function ProtectedRouteUsers() {
  const { loading, isAuthenticated, user } = useAuth();
  if (!loading && !isAuthenticated) return <Navigate to="/access-denied" replace/>;
  if (user?.rol !== 'root' && user?.rol !== 'administrador' && user?.rol !== 'moderador') return <Navigate to="/access-denied" replace/>;
  return <Outlet />;
}
