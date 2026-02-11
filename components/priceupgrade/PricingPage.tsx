"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type BillingCycle = "monthly" | "yearly";
type PlanId = "starter" | "pro" | "business";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  /* ================= PLANS ================= */

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

  const handlePlanClick = (plan: typeof plans[number]) => {
    // 🔹 STARTER PLAN
    if (plan.id === "starter") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/register?plan=starter&billing=monthly");
      }
      return;
    }

    // 🔹 PRO / BUSINESS
    if (!isAuthenticated) {
      // Go to register with plan info
      router.push(
        `/register?plan=${plan.id}&billing=${billingCycle}`
      );
    } else {
      // Already logged in → go to payment
      router.push(
        `/payment?plan=${plan.id}&billing=${billingCycle}`
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* HERO */}
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

      {/* BILLING TOGGLE */}
      <div className="flex justify-center mt-12">
        <div className="bg-white shadow-md rounded-full p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === cycle
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
            >
              {cycle === "monthly"
                ? "Monthly"
                : "Yearly (2 months free)"}
            </button>
          ))}
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="flex flex-wrap justify-center gap-10 mt-20 pb-24">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white rounded-3xl p-8 w-80 text-center shadow-xl transition ${
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

            {/* <ul className="text-left space-y-2 border-t pt-4 text-gray-700"> */}
            <ul className="text-left space-y-2 border-t pt-4 text-gray-700">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan)}
              className="mt-6 w-full py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
