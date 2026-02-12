"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type BillingCycle = "monthly" | "yearly";
type PlanId = "starter" | "pro" | "business";

type Plan = {
  id: PlanId;
  name: string;
  popular: boolean;
  price: { monthly: number; yearly: number };
  features: string[];
  buttonText: string;
};

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  const plans: Plan[] = [
    {
      id: "starter",
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
      id: "pro",
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
      id: "business",
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

  const handlePlanClick = useCallback(
    (planId: PlanId) => {
      router.push(
        `/register?plan=${planId}&billing=${billingCycle}`
      );
    },
    [billingCycle, router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-20 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          QuickBillz Pricing
        </h1>
        <p className="opacity-90 text-lg">
          Simple billing & invoicing for startups
        </p>
      </motion.div>

      {/* ================= BILLING TOGGLE ================= */}
      <div className="flex justify-center mt-10 px-4">
        <div className="bg-white shadow-md rounded-full p-1 flex">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                billingCycle === cycle
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {cycle === "monthly"
                ? "Monthly"
                : "Yearly (2 months free)"}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PLANS ================= */}
      <div className="flex flex-wrap justify-center gap-8 mt-16 pb-24 px-4">

        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white rounded-3xl p-8 w-full sm:w-80 text-center shadow-xl transition-all duration-300 ${
              plan.popular
                ? "border-4 border-indigo-600"
                : "border border-gray-100"
            }`}
          >
            {/* PLAN TITLE */}
            <h2 className="text-2xl font-bold mb-2">
              {plan.name} {plan.popular && "🌟"}
            </h2>

            {/* PRICE */}
            <p className="text-indigo-600 text-3xl mb-4 font-bold">
              ₹{plan.price[billingCycle]}
              <span className="text-base text-gray-500 ml-1">
                /{billingCycle === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            {/* FEATURES */}
            <ul className="text-left space-y-2 border-t pt-4 text-gray-700">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            {/* BUTTON */}
            <button
              onClick={() => handlePlanClick(plan.id)}
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
