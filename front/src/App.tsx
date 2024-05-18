import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import ReportDepartmentPage from "./pages/admin/reports/ReportDepartmentPage";
import ReportAreasPage from "./pages/admin/reports/ReportAreasPage";


export default function App() {
  return (
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
              <Route path="company" element={<CompanyPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="nomina" element={<NominaPage />} />

              <Route path="reports/departments" element={<ReportDepartmentPage />} />
              <Route path="reports/areas" element={<ReportAreasPage />} />
              <Route path="reports/users" element={<UsersPage />} />
              <Route path="reports/company" element={<CompanyPage />} />
              <Route path="reports/employees" element={<EmployeesPage />} />
              <Route path="reports/nomina" element={<NominaPage />} />
            </Route>
          </Route>
          <Route path="/access-denied" element={<ErrorAccessPage />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </BrowserRouter>
    </GeneralProvider>
  )
}