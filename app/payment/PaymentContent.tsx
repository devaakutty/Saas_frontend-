"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/server/api";

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

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [billing, setBilling] = useState<BillingType | null>(null);

  /* ================= VALIDATE QUERY PARAMS ================= */

  useEffect(() => {
    const rawPlan = searchParams.get("plan");
    const rawBilling = searchParams.get("billing");

    const isValidPlan =
      rawPlan === "starter" ||
      rawPlan === "pro" ||
      rawPlan === "business";

    const isValidBilling =
      rawBilling === "monthly" || rawBilling === "yearly";

    if (isValidPlan && isValidBilling) {
      setPlan(rawPlan);
      setBilling(rawBilling);
    }
  }, [searchParams]);

  /* ================= FREE PLAN AUTO UPGRADE ================= */

  useEffect(() => {
    if (!plan || !billing) return;

    if (plan === "starter") {
      (async () => {
        try {
          setLoading(true);

          await apiFetch("/payments/verify", {
            method: "POST",
            body: JSON.stringify({
              plan,
              billing,
              provider: "free",
            }),
          });

          router.replace("/dashboard/settings/company");
        } catch (err: any) {
          alert(err.message || "Upgrade failed");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [plan, billing, router]);

  /* ================= INVALID ================= */

  if (!plan || !billing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Invalid payment request
        </p>
      </div>
    );
  }

  const price = PLAN_PRICES[plan][billing];

  /* ================= PAYMENT HANDLER ================= */

  const handlePayment = async (
    provider: "razorpay" | "stripe"
  ) => {
    try {
      setLoading(true);

      await apiFetch("/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          plan,
          billing,
          provider,
        }),
      });

      router.push("/dashboard/settings/company");

    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Payment
        </h1>

        <div className="border rounded-xl p-5 mb-6 space-y-3 bg-gray-50">
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

          <div className="flex justify-between border-t pt-3 mt-3">
            <span>Total Amount</span>
            <span className="text-indigo-600 font-bold text-xl">
              ₹{price}
            </span>
          </div>
        </div>

        {plan !== "starter" && (
          <>
            <button
              disabled={loading}
              onClick={() => handlePayment("razorpay")}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg mb-3"
            >
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>

            <button
              disabled={loading}
              onClick={() => handlePayment("stripe")}
              className="w-full border py-3 rounded-lg"
            >
              {loading ? "Processing..." : "Pay with Stripe"}
            </button>
          </>
        )}

        <button
          onClick={() => router.back()}
          disabled={loading}
          className="w-full text-sm text-gray-500 mt-5"
        >
          ← Go back
        </button>
      </div>
    </div>
  );
}
