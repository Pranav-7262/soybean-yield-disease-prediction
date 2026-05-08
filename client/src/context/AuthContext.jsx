import React, { createContext, useState, useEffect, useCallback } from "react";
import { api, handleApiError } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.auth.getCurrentUser();
        // Axios response structure: response.data contains the actual data
        if (response.data?.data) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = useCallback(async (userName, email, password) => {
    try {
      setError(null);
      const response = await api.auth.register({ userName, email, password });
      const userData = response.data?.data;
      if (userData) {
        setUser(userData);
        return { success: true, data: userData };
      }
      throw new Error(response.data?.message || "Registration failed");
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await api.auth.login({ email, password });
      const userData = response.data?.data;
      if (userData) {
        setUser(userData);
        return { success: true, data: userData };
      }
      throw new Error(response.data?.message || "Login failed");
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await api.auth.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      // Don't throw - always clear user on logout attempt
      setUser(null);
    }
  }, []);

  const updateUsername = useCallback(async (username) => {
    try {
      setError(null);
      const response = await api.auth.updateUsername(username);
      const userData = response.data?.data;
      if (userData) {
        setUser(userData);
        return { success: true, data: userData };
      }
      throw new Error(response.data?.message || "Update failed");
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  }, []);

  const updateEmail = useCallback(async (email) => {
    try {
      setError(null);
      const response = await api.auth.updateEmail(email);
      const userData = response.data?.data;
      if (userData) {
        setUser(userData);
        return { success: true, data: userData };
      }
      throw new Error(response.data?.message || "Update failed");
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      setError(null);
      const response = await api.auth.changePassword({
        oldPassword,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  }, []);

  const resetAccount = useCallback(async () => {
    try {
      setError(null);
      await api.auth.resetAccount();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateUsername,
        updateEmail,
        changePassword,
        resetAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
