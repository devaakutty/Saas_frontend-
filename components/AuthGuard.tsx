"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = useMemo(() => {
    return (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/payment")
    );
  }, [pathname]);

  const isAuthRoute =
    pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (loading) return;

    // Not logged in → redirect to login
    if (!user && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    // Logged in → block login/register
    if (user && isAuthRoute) {
      router.replace("/dashboard");
      return;
    }
  }, [user, loading, isProtectedRoute, isAuthRoute, router]);

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] text-white">
        <div className="animate-pulse text-lg tracking-wide">
          Loading...
        </div>
      </div>
    );
  }

  /* ================= BLOCK PROTECTED CONTENT ================= */

  if (!user && isProtectedRoute) {
    return null; // will redirect via useEffect
  }

  return <>{children}</>;
}
