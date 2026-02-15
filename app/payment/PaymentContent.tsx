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
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [billing, setBilling] = useState<BillingType | null>(null);
  const [ready, setReady] = useState(false);

  /* ================= READ QUERY PARAMS ================= */

  useEffect(() => {
    const rawPlan = searchParams.get("plan");
    const rawBilling = searchParams.get("billing");

    if (
      rawPlan &&
      rawBilling &&
      (rawPlan === "starter" ||
        rawPlan === "pro" ||
        rawPlan === "business") &&
      (rawBilling === "monthly" ||
        rawBilling === "yearly")
    ) {
      setPlan(rawPlan);
      setBilling(rawBilling);
    } else {
      setPlan(null);
      setBilling(null);
    }

    setReady(true);
  }, [searchParams]);

  /* ================= HANDLE PAYMENT ================= */

  const handlePayment = async (
    provider: "razorpay" | "stripe"
  ) => {
    if (!plan) return;

    try {
      setLoading(true);

      const email =
        typeof window !== "undefined"
          ? localStorage.getItem("pendingEmail")
          : null;

      if (!email) {
        alert("Session expired. Please register again.");
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

      // Clear temp email
      localStorage.removeItem("pendingEmail");

      // Refresh logged in user
      await refreshUser();

      router.replace("/dashboard");

    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING GUARD ================= */

  if (!ready) return null;

  if (!plan || !billing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Invalid payment details
      </div>
    );
  }

  const price = PLAN_PRICES[plan][billing];

  /* ================= UI ================= */

  return (
    <div
      className={`${inter.className} min-h-screen bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] text-white relative overflow-hidden`}
    >
      <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-purple-600/30 blur-[160px] rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] bg-pink-600/20 blur-[140px] rounded-full" />

      <div className="relative z-10 px-6 py-[120px] flex flex-col items-center">

        <div className="text-center mb-16 max-w-3xl">
          <h1
            className={`${playfair.className} text-[64px] md:text-[80px] leading-[0.95] tracking-tight`}
          >
            Complete your{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upgrade
            </span>
          </h1>

          <p className="mt-6 text-white/60 text-lg">
            Secure checkout powered by trusted payment providers.
          </p>
        </div>

        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-10 shadow-2xl">

          <div className="space-y-4 text-white/80 text-sm">
            <div className="flex justify-between">
              <span>Plan</span>
              <span className="capitalize font-semibold text-white">
                {plan}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Billing</span>
              <span className="capitalize font-semibold text-white">
                {billing}
              </span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
              <span>Total</span>
              <span className="text-3xl font-bold text-purple-400">
                ₹{price}
              </span>
            </div>
          </div>

          {plan !== "starter" && (
            <div className="mt-10 space-y-4">
              <button
                disabled={loading}
                onClick={() => handlePayment("razorpay")}
                className="w-full py-4 rounded-[20px] bg-purple-500 text-white font-semibold transition-all duration-300 hover:bg-purple-600 shadow-lg"
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>

              <button
                disabled={loading}
                onClick={() => handlePayment("stripe")}
                className="w-full py-4 rounded-[20px] bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                {loading ? "Processing..." : "Pay with Stripe"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
