import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/context/AuthContext";

//PAGES
import LandingPage from "./pages/LandingPage";
import Error404Page from "./pages/errors/Error404Page"; 

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import LayoutDashboard from "./layout/LayoutDashboard";
import Dashboard from "./pages/admin/DashboardPage";

import InputDemo from "./pages/admin/uikit/input/page";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LayoutDashboard />} >
              <Route index element={<Dashboard />} />
              <Route path="about" element={<LandingPage />} />
              <Route path="uikit/input" element={<InputDemo />} />
            </Route>
            <Route path="*" element={<Error404Page />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
