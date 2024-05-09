import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/context/AuthContext";

//PAGES
import LandingPage from "./pages/LandingPage";
import Error404Page from "./pages/errors/Error404Page";

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import LayoutDashboard from "./layout/LayoutDashboard";
import Dashboard from "./pages/admin/DashboardPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import AreasPage from "./pages/admin/AreasPage";
import UsersPage from "./pages/admin/UsersPage";
import CompanyPage from "./pages/admin/CompanyPage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import NominaPage from "./pages/admin/NominaPage";
import ErrorAccessPage from "./pages/errors/ErrorAccessPage";
import { GeneralProvider } from "./api/context/GeneralContext";


export default function App() {
  return (
    <AuthProvider>
      <GeneralProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<LayoutDashboard />} >
                <Route index element={<Dashboard />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="areas" element={<AreasPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="company/:id" element={<CompanyPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="nomina" element={<NominaPage />} />
              </Route>
            </Route>
            <Route path="/access-denied" element={<ErrorAccessPage />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </BrowserRouter>
      </GeneralProvider>
    </AuthProvider>
  )
}