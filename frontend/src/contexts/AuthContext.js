import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
          // Get current user info
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // Clear invalid token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (googleToken) => {
    try {
      setLoading(true);
      setError(null);

      // Exchange Google token for our JWT
      const { token, user: userData } = await authService.login(googleToken);

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set user data
      setUser(userData);

      return userData;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear user data
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;

    // This mapping should match the backend role IDs
    const roleMap = {
      1: "admin",
      2: "teacher",
      3: "student",
    };

    const userRole = roleMap[user.role_id];

    return requiredRoles.includes(userRole);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
