"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔐 Protected routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/payment");

  useEffect(() => {
    if (loading) return;

    // If NOT logged in → block protected routes
    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    // If logged in → block auth pages
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router, isProtectedRoute]);

  // 🛑 Prevent rendering protected pages until auth resolved
  if (loading) return null;

  if (!isAuthenticated && isProtectedRoute) {
    return null;
  }

  return <>{children}</>;
}
