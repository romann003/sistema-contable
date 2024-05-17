import { createContext, useContext, useEffect, useRef, useState } from "react";

import {
  registerRequest,
  loginRequiest,
  verifyTokenRequest,
} from "../auth.js";
import Cookies from "js-cookie";
import { Toast } from 'primereact/toast';


export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequiest(user);
      setIsAuthenticated(true);
      setUser(res.data);
      window.location.reload();
      toast.current?.show({ severity: 'info', summary: 'Login', detail: 'Has iniciado sesion', life: 3000 });
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    toast.current?.show({ severity: 'info', summary: 'Logout', detail: 'Has cerrado sesion', life: 3000 });
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, loading, user, isAuthenticated, errors }}
    >
      <Toast ref={toast} />
      {errors.map((error) => (
        toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
      ))}
      {children}
    </AuthContext.Provider>
  );
};