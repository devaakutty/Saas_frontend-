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

export type User = {
  id: string;
  email: string;
  role: "owner" | "member";
  plan: "starter" | "pro" | "business";
  isPaymentVerified: boolean;
  // 🔥 Add limits here so global update works
  userLimit?: number;
  invoiceLimit?: number;


  // 🔥 Add profile fields here so global update works
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ✅ Added
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiFetch<User>("/users/me");
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };

    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await refreshUser();
    router.replace("/dashboard");
  };

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
        setUser, // ✅ Exposed now
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
