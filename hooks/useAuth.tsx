"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
};


type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔄 RESTORE SESSION ON REFRESH */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await apiFetch<User>("/users/me");
        setUser(me); // ✅ cookie valid
      } catch {
        setUser(null); // ❌ not logged in
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* ✅ LOGIN (cookie already set by backend) */
  const login = async () => {
    const me = await apiFetch<User>("/users/me");
    setUser(me);
    router.replace("/dashboard");
  };

  /* 🚪 LOGOUT */
  const logout = async () => {
    await apiFetch("/auth/logout", {
      method: "POST",
    });

    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
