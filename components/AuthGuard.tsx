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

    const isAuthPage =
      pathname === "/login" || pathname === "/register";

    const isDashboard = pathname.startsWith("/dashboard");
    const isPayment = pathname.startsWith("/payment");

    /* ================= NOT LOGGED IN ================= */

    if (!user) {
      if (isDashboard || isPayment) {
        router.replace("/login");
      }
      return;
    }

    /* ================= BLOCK LOGIN WHEN LOGGED IN ================= */

    if (user && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    /* ================= PLAN ENFORCEMENT ================= */

    // Pro/Business must complete payment
    if (
      user.plan !== "starter" &&
      !user.isPaymentVerified &&
      !isPayment
    ) {
      router.replace("/payment");
      return;
    }

    // Starter should not access payment page
    if (user.plan === "starter" && isPayment) {
      router.replace("/dashboard");
      return;
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
