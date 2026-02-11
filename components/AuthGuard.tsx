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

  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (loading) return; // ⛔ wait until auth check finishes

    // 🔐 Protect dashboard routes
    if (!isAuthenticated && isDashboardRoute) {
      router.replace("/login");
    }

    // 🚫 Prevent logged-in users from visiting login/register
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router, isDashboardRoute, loading]);

  // ⛔ Prevent dashboard from rendering until auth resolved
  if (loading) {
    return null; // or loading spinner
  }

  if (!isAuthenticated && isDashboardRoute) {
    return null;
  }

  return <>{children}</>;
}
