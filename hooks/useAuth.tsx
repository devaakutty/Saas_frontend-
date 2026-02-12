"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

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
  refreshUser: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= REFRESH USER ================= */

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiFetch<User>("/users/me");
      setUser(me);
    } catch (err: any) {
      // If unauthorized, clear user
      setUser(null);
    }
  }, []);

  /* ================= RESTORE SESSION ================= */

  useEffect(() => {
    const init = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false); // 🔥 always stop loading
      }
    };

    init();
  }, [refreshUser]);

  /* ================= LOGIN ================= */

  const login = async () => {
    await refreshUser();
    router.replace("/dashboard");
  };

  /* ================= LOGOUT ================= */

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
        refreshUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
