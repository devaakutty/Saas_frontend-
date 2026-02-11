"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const PLAN_PRICES: Record<string, any> = {
  starter: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 499,
    yearly: 4999,
  },
  business: {
    monthly: 999,
    yearly: 9999,
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const plan = searchParams.get("plan") as
    | "starter"
    | "pro"
    | "business"
    | null;

  const billing = searchParams.get("billing") as
    | "monthly"
    | "yearly"
    | null;

  // ❌ Safety check
  if (!plan || !billing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid payment request</p>
      </div>
    );
  }

  const price = PLAN_PRICES[plan][billing];

  /* ================= HANDLE PAYMENT SUCCESS ================= */
  const handlePaymentSuccess = async (provider: "razorpay" | "stripe") => {
    try {
      setLoading(true);

      // 🔥 In real life:
      // 1. Open Razorpay / Stripe checkout
      // 2. On success → call backend verify API

      await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan, // pro | business
        }),
      });

      // ✅ Redirect after successful upgrade
      router.push("/dashboard");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complete Payment
        </h1>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Plan</span>
            <span className="font-semibold capitalize">{plan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Billing</span>
            <span className="font-semibold capitalize">{billing}</span>
          </div>

          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-800 font-semibold">
              Total Amount
            </span>
            <span className="text-indigo-600 font-bold text-lg">
              ₹{price}
            </span>
          </div>
        </div>

        {/* Payment Buttons */}
        <button
          disabled={loading}
          onClick={() => handlePaymentSuccess("razorpay")}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-3 hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>

        <button
          disabled={loading}
          onClick={() => handlePaymentSuccess("stripe")}
          className="w-full border py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>

        {/* Back */}
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="w-full text-sm text-gray-500 mt-4 hover:underline"
        >
          ← Go back
        </button>
      </div>
    </div>
  );
}
