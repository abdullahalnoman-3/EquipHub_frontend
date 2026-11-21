"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { User, ApiResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  socialLogin: (data: { name: string; email: string; photoURL?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (formData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session from LocalStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("equiphub_token");
        const storedUser = localStorage.getItem("equiphub_user");

        if (storedToken) {
          setToken(storedToken);

          // Fast recovery from local cache to prevent UI flash
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error("Failed to parse cached user", e);
            }
          }

          // Verify with backend
          try {
            const response = await api.get("/auth/me");
            if (response.data && response.data.success) {
              const freshUser = response.data.data?.user || response.data.user;
              setUser(freshUser);
              localStorage.setItem("equiphub_user", JSON.stringify(freshUser));
            }
          } catch (err: any) {
            // If token has expired or is invalid
            if (err.response?.status === 401) {
              localStorage.removeItem("equiphub_token");
              localStorage.removeItem("equiphub_user");
              setUser(null);
              setToken(null);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { success, message, token: receivedToken, user: receivedUser, data } = response.data;

      const authToken = receivedToken || data?.token;
      const authUser = receivedUser || data?.user;

      if (success && authToken && authUser) {
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem("equiphub_token", authToken);
        localStorage.setItem("equiphub_user", JSON.stringify(authUser));
        return { success: true, message: message || "Logged in successfully" };
      }
      return { success: false, message: message || "Login failed" };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to log in. Please check your credentials.";
      return { success: false, message: errorMsg };
    }
  };

  // Google Social login handler
  const socialLogin = async (socialData: { name: string; email: string; photoURL?: string }) => {
    try {
      const response = await api.post("/auth/social-login", socialData);
      const { success, message, token: receivedToken, user: receivedUser, data } = response.data;

      const authToken = receivedToken || data?.token;
      const authUser = receivedUser || data?.user;

      if (success && authToken && authUser) {
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem("equiphub_token", authToken);
        localStorage.setItem("equiphub_user", JSON.stringify(authUser));
        return { success: true, message: message || "Google login successful" };
      }
      return { success: false, message: message || "Google login failed" };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to sign in with Google.";
      return { success: false, message: errorMsg };
    }
  };

  // Register handler
  const register = async (formData: any) => {
    try {
      const response = await api.post("/auth/register", formData);
      const { success, message, token: receivedToken, user: receivedUser, data } = response.data;

      const authToken = receivedToken || data?.token;
      const authUser = receivedUser || data?.user;

      if (success && authToken && authUser) {
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem("equiphub_token", authToken);
        localStorage.setItem("equiphub_user", JSON.stringify(authUser));
        return { success: true, message: message || "Account registered successfully" };
      }
      return { success: true, message: message || "Account registered successfully. Please login." };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Registration failed. Please try again.";
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    try {
      api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("equiphub_token");
      localStorage.removeItem("equiphub_user");
      setUser(null);
      setToken(null);
    }
  };

  // Update user state locally
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("equiphub_user", JSON.stringify(updatedUser));
  };

  // Refresh user data from API
  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data && response.data.success) {
        const freshUser = response.data.data?.user || response.data.user;
        setUser(freshUser);
        localStorage.setItem("equiphub_user", JSON.stringify(freshUser));
      }
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "Admin";
  const isOwner = user?.role === "Owner";
  const isCustomer = user?.role === "Customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isOwner,
        isCustomer,
        login,
        socialLogin,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
