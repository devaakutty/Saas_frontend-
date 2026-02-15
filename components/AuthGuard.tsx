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

  useEffect(() => {
    if (loading) return;

    const isProtected =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/payment");

    const isAuthPage =
      pathname === "/login" || pathname === "/register";

    // ❌ Not logged in → login
    if (!user && isProtected) {
      router.replace("/login");
      return;
    }

    // ✅ Logged in → block login/register
    if (user && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    // 💎 Plan Enforcement
    if (user) {
      // Pro/Business must complete payment
      if (
        user.plan !== "starter" &&
        !user.isPaymentVerified &&
        pathname !== "/payment"
      ) {
        router.replace("/payment");
        return;
      }

      // Starter should not access payment
      if (user.plan === "starter" && pathname === "/payment") {
        router.replace("/dashboard");
        return;
      }
    }

  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] text-white">
        <div className="animate-pulse text-lg tracking-wide">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
