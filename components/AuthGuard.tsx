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

    const pendingEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("pendingEmail")
        : null;

    /* ================= NOT LOGGED IN ================= */

    if (!user) {
      // ❌ Block dashboard always
      if (isDashboard) {
        router.replace("/login");
        return;
      }

      // ❌ Block payment if not coming from register
      if (isPayment && !pendingEmail) {
        router.replace("/login");
        return;
      }

      return;
    }

    /* ================= BLOCK LOGIN WHEN LOGGED IN ================= */

    if (isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    /* ================= PLAN ENFORCEMENT ================= */

    // 🔵 Pro / Business must complete payment
    if (
      user.plan !== "starter" &&
      !user.isPaymentVerified &&
      !isPayment
    ) {
      router.replace(
        `/payment?plan=${user.plan}&billing=monthly`
      );
      return;
    }


    // 🟢 Starter should not access payment page
    if (user.plan === "starter" && isPayment) {
      router.replace("/dashboard");
      return;
    }

  }, [user, loading, pathname, router]);

  /* ================= LOADING SCREEN ================= */

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
