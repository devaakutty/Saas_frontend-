"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

type PlanType = "starter" | "pro" | "business";
type BillingType = "monthly" | "yearly";

const PLAN_PRICES: Record<
  PlanType,
  { monthly: number; yearly: number }
> = {
  starter: { monthly: 0, yearly: 0 },
  pro: { monthly: 499, yearly: 4999 },
  business: { monthly: 999, yearly: 9999 },
};

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [billing, setBilling] =
    useState<BillingType>("monthly");
  const [ready, setReady] = useState(false);

  /* ================= DETERMINE PLAN SOURCE ================= */

  useEffect(() => {
    // 🔵 If user is logged in → use backend plan
    if (user) {
      if (user.plan === "starter") {
        router.replace("/dashboard");
        return;
      }

      setPlan(user.plan as PlanType);
      setReady(true);
      return;
    }

    // 🟡 If coming from register → use query params
    const rawPlan = searchParams.get("plan");
    const rawBilling = searchParams.get("billing");

    if (
      rawPlan === "pro" ||
      rawPlan === "business"
    ) {
      setPlan(rawPlan);
    }

    if (rawBilling === "yearly") {
      setBilling("yearly");
    }

    setReady(true);
  }, [user, searchParams, router]);

  /* ================= HANDLE PAYMENT ================= */

  const handlePayment = async () => {
    if (!plan) return;

    try {
      setLoading(true);

      // 🟢 If user exists → use user email
      const email =
        user?.email ||
        (typeof window !== "undefined"
          ? localStorage.getItem("pendingEmail")
          : null);

      if (!email) {
        router.replace("/register");
        return;
      }

      await apiFetch("/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          email,
          plan,
        }),
      });

      localStorage.removeItem("pendingEmail");

      await refreshUser();

      router.replace("/dashboard");
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFETY GUARD ================= */

  if (!ready) return null;

  if (!plan) {
    router.replace("/");
    return null;
  }

  const price = PLAN_PRICES[plan][billing];

  /* ================= UI ================= */

  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] text-white relative overflow-hidden`}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition"
      >
        ← Back
      </button>

      <div className="relative z-10 px-6 py-[120px] flex flex-col items-center">

        <h1
          className={`${playfair.className} text-5xl text-center mb-6`}
        >
          Complete your{" "}
          <span className="text-purple-400">
            Upgrade
          </span>
        </h1>

        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-10 shadow-2xl">

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Plan</span>
              <span className="capitalize font-semibold">
                {plan}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Billing</span>
              <span className="capitalize font-semibold">
                {billing}
              </span>
            </div>

            <div className="flex justify-between border-t pt-4 mt-4">
              <span>Total</span>
              <span className="text-3xl font-bold text-purple-400">
                ₹{price}
              </span>
            </div>
          </div>

          <div className="mt-10">
            <button
              disabled={loading}
              onClick={handlePayment}
              className="w-full py-4 rounded-[20px] bg-purple-500 hover:bg-purple-600 transition font-semibold"
            >
              {loading ? "Processing..." : "Complete Payment"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
