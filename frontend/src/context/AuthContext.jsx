import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bookora_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("bookora_token") || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authService
        .getCurrentUser()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("bookora_user", JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user: loggedUser, token: authToken } = response.data;

      setUser(loggedUser);
      setToken(authToken);

      localStorage.setItem("bookora_token", authToken);
      localStorage.setItem("bookora_user", JSON.stringify(loggedUser));
      setIsAuthModalOpen(false);
      return { success: true, user: loggedUser };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password });
      const { user: newUser, token: authToken } = response.data;

      setUser(newUser);
      setToken(authToken);

      localStorage.setItem("bookora_token", authToken);
      localStorage.setItem("bookora_user", JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return { success: true, user: newUser };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bookora_token");
    localStorage.removeItem("bookora_user");
  };

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        isAuthModalOpen,
        authMode,
        openAuth,
        closeAuth,
        setAuthMode,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
