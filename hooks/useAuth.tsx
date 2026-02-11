"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

type User = {
  id: string;
  email: string;
  role: "owner" | "member";
  plan?: string;
  userLimit?: number;
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
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔄 RESTORE SESSION SAFELY */
  useEffect(() => {
    const publicRoutes = ["/login", "/register"];

    // Skip auth check on public pages
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const me = await apiFetch<User>("/users/me");
        setUser(me);
      } catch (err) {
        console.log("Auth restore failed");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  /* ✅ LOGIN */
  const login = async () => {
    try {
      const me = await apiFetch<User>("/users/me");
      setUser(me);
      router.replace("/dashboard");
    } catch (err) {
      console.error("Login restore failed");
    }
  };

  /* 🚪 LOGOUT */
  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout failed");
    }

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
    // throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
