import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(
      "[AuthContext] Montando contexto. Token:",
      localStorage.getItem("token")
    );
    const token = localStorage.getItem("token");
    if (token) {
      authService
        .getCurrentUser()
        .then((userData) => {
          console.log("[AuthContext] Usuario obtenido:", userData);
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch((err) => {
          console.log("[AuthContext] Error al obtener usuario:", err);
          authService.logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(
      "[AuthContext] user:",
      user,
      "isAuthenticated:",
      isAuthenticated
    );
  }, [user, isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Intentando login con:", email);
      const { token, user } = await authService.login({ email, password });
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);
      console.log("[AuthContext] Login exitoso. Usuario:", user);
    } catch (error: any) {
      console.log("[AuthContext] Error en login:", error);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("[AuthContext] Intentando registro con:", email);
      const { token, user } = await authService.register({
        name,
        email,
        password,
      });
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);
      console.log("[AuthContext] Registro exitoso. Usuario:", user);
    } catch (error: any) {
      console.log("[AuthContext] Error en registro:", error);
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  const logout = () => {
    console.log("[AuthContext] Logout ejecutado");
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    console.log("[AuthContext] Renderizando LoadingSpinner");
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
