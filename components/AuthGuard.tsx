"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/payment");

  useEffect(() => {
    if (loading) return;

    // If not logged in → block protected routes
    if (!user && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    // If logged in → block auth pages
    if (
      user &&
      (pathname === "/login" || pathname === "/register")
    ) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router, isProtectedRoute]);

  if (loading) return null;

  if (!user && isProtectedRoute) {
    return null;
  }

  return <>{children}</>;
}
