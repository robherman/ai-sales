"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe, login as apiLogin } from "../apis/auth";
import { signIn, signOut } from "../auth";
import Loading from "../../components/loading";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ accessToken: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        setUser(response);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.debug(`Login`);
      const response = await apiLogin(email, password);
      localStorage.setItem("token", response.accessToken);
      await signIn(response.accessToken);
      setUser(response.user);
      router.push("/");
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.debug(`Logout`);
      await signOut();
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error(`Failed to signout`, error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
