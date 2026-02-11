"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type BillingCycle = "monthly" | "yearly";
type PlanId = "starter" | "pro" | "business";

export default function PricingPage() {
  const router = useRouter();

  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  // 🔥 Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<{
    plan: "pro" | "business" | null;
    billing: BillingCycle | null;
  }>({ plan: null, billing: null });

  const plans = [
    {
      id: "starter" as PlanId,
      name: "Starter",
      popular: false,
      price: { monthly: 0, yearly: 0 },
      features: [
        "1 User",
        "10 Invoices / month",
        "Basic Dashboard",
        "Email Support",
      ],
      buttonText: "Start Free",
    },
    {
      id: "pro" as PlanId,
      name: "Pro",
      popular: true,
      price: { monthly: 499, yearly: 4999 },
      features: [
        "5 Users",
        "Unlimited Invoices",
        "Analytics Dashboard",
        "Priority Email Support",
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      id: "business" as PlanId,
      name: "Business",
      popular: false,
      price: { monthly: 999, yearly: 9999 },
      features: [
        "10 Users",
        "Custom Branding",
        "AI Insights",
        "Chat + Email Support",
      ],
      buttonText: "Get Business",
    },
  ];

  /* ================= PLAN CLICK ================= */
  const handlePlanClick = (planId: PlanId) => {
    if (planId === "starter") {
      router.push("/register");
      return;
    }

    setSelectedPlan({
      plan: planId,
      billing: billingCycle,
    });
    setShowPayment(true);
  };

  /* ================= PRICE ================= */
  const getPrice = () => {
    if (!selectedPlan.plan || !selectedPlan.billing) return 0;

    if (selectedPlan.plan === "pro") {
      return selectedPlan.billing === "monthly" ? 499 : 4999;
    }
    return selectedPlan.billing === "monthly" ? 999 : 9999;
  };

  /* ================= PAYMENT SUCCESS ================= */
  const handlePaymentSuccess = async () => {
    if (!selectedPlan.plan) return;

    try {
      setLoading(true);

      await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan.plan,
        }),
      });

      setShowPayment(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-24"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          QuickBillz Pricing
        </h1>
        <p className="opacity-90 text-lg">
          Simple billing & invoicing for startups
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <div className="flex justify-center mt-12">
        <div className="bg-white shadow-md rounded-full p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map(
            (cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2 rounded-full font-medium ${
                  billingCycle === cycle
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {cycle === "monthly"
                  ? "Monthly"
                  : "Yearly (2 months free)"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-wrap justify-center gap-10 mt-20 pb-24">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white rounded-3xl p-8 w-80 text-center shadow-xl ${
              plan.popular ? "border-4 border-indigo-600" : ""
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">
              {plan.name} {plan.popular && "🌟"}
            </h2>

            <p className="text-indigo-600 text-3xl mb-4 font-bold">
              ₹{plan.price[billingCycle]}
              <span className="text-base text-gray-500">
                /{billingCycle === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            <ul className="text-left space-y-2 border-t pt-4 text-gray-700">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan.id)}
              className="mt-6 w-full py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* 🔥 PAYMENT MODAL */}
      {showPayment && selectedPlan.plan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Complete Payment
            </h2>

            <div className="border rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-semibold capitalize">
                  {selectedPlan.plan}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Billing</span>
                <span className="font-semibold capitalize">
                  {selectedPlan.billing}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Total</span>
                <span className="font-bold text-indigo-600">
                  ₹{getPrice()}
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handlePaymentSuccess}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-3 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>

            <button
              disabled={loading}
              onClick={handlePaymentSuccess}
              className="w-full border py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay with Stripe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
