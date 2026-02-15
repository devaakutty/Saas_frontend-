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
      if (isDashboard) {
        router.replace("/login");
      }
      return;
    }

    /* ================= BLOCK LOGIN IF LOGGED IN ================= */

    if (isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    /* ================= STARTER PLAN ================= */

    if (user.plan === "starter") {
      if (isPayment) {
        router.replace("/dashboard");
      }
      return;
    }

    /* ================= PRO / BUSINESS ================= */

    // 🚨 IMPORTANT FIX:
    // Only redirect if value is explicitly false
    // if (user.isPaymentVerified === false) {
    //   if (!isPayment) {
    //     router.replace(
    //       `/payment?plan=${user.plan}&billing=monthly`
    //     );
    //   }
    //   return;
    // }

    // If verified, block payment page
    if (user.isPaymentVerified === true && isPayment) {
      router.replace("/dashboard");
      return;
    }

  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63]">
        <div className="animate-pulse text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
