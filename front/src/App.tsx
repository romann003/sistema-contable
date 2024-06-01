import { BrowserRouter, Routes, Route } from "react-router-dom";

//PAGES
import LandingPage from "./pages/LandingPage";
import Error404Page from "./pages/errors/Error404Page";

import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute, ProtectedRouteOnlySuperAdmin, ProtectedRouteOnlyAdmins, ProtectedRouteUsers } from "./ProtectedRoute";
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
import PeriodoLiquidacionPage from "./pages/admin/PeriodoLiquidacionPage";
import ReporteEmployeesPage from "./pages/admin/reports/ReporteEmployeesPage";
import ReportePeriodosPage from "./pages/admin/reports/ReportePeriodosPage";
import ReporteNominasPage from "./pages/admin/reports/ReporteNominasPage";


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


              //? ----------- isSuperAdmin
              <Route element={<ProtectedRouteOnlySuperAdmin />}>
                <Route path="users" element={<UsersPage />} />
                <Route path="company" element={<CompanyPage />} />
              </Route>

                //? ----------- isAdmins
              <Route element={<ProtectedRouteOnlyAdmins />}>
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="puestos" element={<AreasPage />} />
                <Route path="employees" element={<EmployeesPage />} />
              </Route>

                //? ----------- isUsers
              <Route element={<ProtectedRouteUsers />}>
                <Route path="rc/periodo-liquidacion" element={<PeriodoLiquidacionPage />} />
                <Route path="rc/nomina" element={<NominaPage />} />
                //? ----------- Reports
                <Route path="reports/departments" element={<ReportDepartmentPage />} />
                <Route path="reports/puestos" element={<ReportAreasPage />} />
                <Route path="reports/employees" element={<ReporteEmployeesPage />} />
                <Route path="reports/periodos-liquidacion" element={<ReportePeriodosPage />} />
                <Route path="reports/nominas" element={<ReporteNominasPage />} />
              </Route>


            </Route>
          </Route>
          <Route path="/access-denied" element={<ErrorAccessPage />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </BrowserRouter>
    </GeneralProvider>
  )
}