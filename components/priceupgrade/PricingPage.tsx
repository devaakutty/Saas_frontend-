"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

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
  const { user } = useAuth(); // 🔥 important
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

  /* ================= SMART PLAN NAVIGATION ================= */

  const handlePlanClick = useCallback(
    (planId: PlanId) => {

      // 🟢 STARTER PLAN
      if (planId === "starter") {
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/register?plan=starter&billing=monthly");
        }
        return;
      }

      // 🔵 PRO / BUSINESS

      // If NOT logged in → Register first
      if (!user) {
        router.push(
          `/register?plan=${planId}&billing=${billingCycle}`
        );
        return;
      }

      // If logged in → Direct to payment
      router.push(
        `/payment?plan=${planId}&billing=${billingCycle}`
      );

    },
    [billingCycle, router, user]
  );

  return (
    <div
      className={`${inter.className} min-h-screen text-white bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] relative overflow-hidden`}
    >
      {/* Glow Effects */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[140px] rounded-full" />

      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6 pt-[120px] pb-[100px]"
      >
        <h1
          className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight`}
        >
          <span className="font-light">
            Improve your
          </span>
          <br />
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Billing Power
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
          Elegant invoicing and smart business tools for modern startups.
        </p>
      </motion.div>

      {/* ================= BILLING TOGGLE ================= */}
      <div className="flex justify-center px-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-2 flex shadow-lg">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-8 py-3 rounded-full transition-all duration-300 ${
                billingCycle === cycle
                  ? "bg-white text-black font-semibold"
                  : "text-gray-300 hover:text-white"
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
      <div className="flex flex-wrap justify-center gap-10 mt-20 pb-[120px] px-6 relative z-10">

        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] p-10 w-full sm:w-[340px] text-center shadow-2xl transition-all ${
              plan.popular
                ? "ring-2 ring-purple-400"
                : ""
            }`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              {plan.name}
            </h2>

            <p className="text-4xl font-bold mb-6">
              ₹{plan.price[billingCycle]}
              <span className="text-base text-gray-300 ml-2">
                /{billingCycle === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            <ul className="space-y-3 text-gray-300 text-left mb-8">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan.id)}
              className="w-full py-3 rounded-xl font-semibold backdrop-blur-md bg-white/20 hover:bg-white/30 transition-all"
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
