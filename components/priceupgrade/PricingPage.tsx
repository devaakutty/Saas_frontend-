"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Playfair_Display, Inter } from "next/font/google";
import AnimatedFace from "@/components/AnimatedFace";


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
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [aiMessage, setAiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);



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
      {/* ================= TOP NAV ================= */}
      <div className="absolute top-6 right-6 z-20">
        {!user ? (
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90 transition-all duration-300"
          >
            Dashboard
          </button>
        )}
      </div>

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
      {/* <div className="flex justify-center px-6">
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
      </div> */}

      {/* ================= BILLING TOGGLE ================= */}
<div className="flex justify-center px-6 mt-6">
  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-2 flex shadow-lg">

    {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => {
      const isActive = billingCycle === cycle;

      return (
        // <motion.button
        //   key={cycle}
        //   onClick={() => setBillingCycle(cycle)}
        //   whileHover={{ scale: 1.05 }}
        //   whileTap={{ scale: 0.95 }}
        //   className={`relative flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-300 ${
        //     isActive
        //       ? "bg-white text-black font-semibold"
        //       : "text-gray-300 hover:text-white"
        //   }`}
        // >
        //   {/* Animated Emoji */}
        //   <motion.span
        //     initial={{ rotate: 0, scale: 1 }}
        //     whileHover={{ rotate: 15, scale: 1.2 }}
        //     transition={{ type: "spring", stiffness: 300 }}
        //     className="text-xl"
        //   >
        //     {cycle === "monthly" ? "🤓" : "🎧"}
        //   </motion.span>

        //   {/* Text */}
        //   {cycle === "monthly"
        //     ? "Monthly"
        //     : "Yearly (2 months free)"}
        // </motion.button>
        <motion.button
  key={cycle}
  onClick={() => setBillingCycle(cycle)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`relative flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-300 ${
    isActive
      ? "bg-white text-black font-semibold"
      : "text-gray-300 hover:text-white"
  }`}
>
  <AnimatedFace />

  {cycle === "monthly"
    ? "Monthly"
    : "Yearly (2 months free)"}
       </motion.button>

          );
        })}
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
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                {plan.buttonText}
              </button>

              </motion.div>
            ))}

          </div>
      {/* ================= AI CHAT ================= */}
      <div className="fixed bottom-6 right-6 z-50">

        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-full rounded-2xl shadow-3xl text-black text-2xl flex items-center justify-center"
          >
            🤖
          </button>
        )}

        {isChatOpen && (
          <div className="w-[350px] h-[450px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 border-b border-white/20 flex justify-between items-center text-white font-semibold">
              AI Assistant
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-sm text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/20 flex items-center">
              <input
                type="text"
                placeholder="Ask about pricing..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm"
              />

              <button
                onClick={async () => {
                  if (!aiMessage.trim()) return;

                  const userMessage = aiMessage;
                  setMessages((prev) => [
                    ...prev,
                    { role: "user", content: userMessage },
                  ]);
                  setAiMessage("");

                  const res = await fetch("/api/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage }),
                  });

                  const data = await res.json();

                  setMessages((prev) => [
                    ...prev,
                    { role: "ai", content: data.reply },
                  ]);
                }}
                className="ml-2 px-3 py-1 bg-white text-black rounded-full text-sm font-semibold"
              >
                Send
              </button>
            </div>

          </div>
        )}
      </div>

    </div>

    
  );
}
