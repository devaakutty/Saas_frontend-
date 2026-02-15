"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";
import { Playfair_Display, Inter } from "next/font/google";

/* ================= FONTS ================= */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

/* ================= TYPES ================= */

type PlanId = "starter" | "pro" | "business";
type BillingCycle = "monthly" | "yearly";

/* ================= PLAN PRICES ================= */

const PLAN_PRICES: Record<
  PlanId,
  { monthly: number; yearly: number }
> = {
  starter: { monthly: 0, yearly: 0 },
  pro: { monthly: 499, yearly: 4999 },
  business: { monthly: 999, yearly: 9999 },
};

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [plan, setPlan] = useState<PlanId>("starter");
  const [billing, setBilling] =
    useState<BillingCycle>("monthly");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= READ PLAN PARAMS ================= */

  useEffect(() => {
    const rawPlan = searchParams.get("plan");
    const rawBilling = searchParams.get("billing");

    if (rawPlan === "pro" || rawPlan === "business") {
      setPlan(rawPlan);
    }

    if (rawBilling === "yearly") {
      setBilling("yearly");
    }
  }, [searchParams]);

  const price = PLAN_PRICES[plan][billing];

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          mobile: onlyDigits,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */

    // const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault();
    //   setError("");

    //   if (
    //     !formData.name ||
    //     !formData.mobile ||
    //     !formData.email ||
    //     !formData.password
    //   ) {
    //     setError("All fields are required");
    //     return;
    //   }

    //   if (formData.mobile.length !== 10) {
    //     setError("Mobile number must be exactly 10 digits");
    //     return;
    //   }

    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(formData.email)) {
    //     setError("Please enter a valid email address");
    //     return;
    //   }

    //   try {
    //     setLoading(true);

    //     await apiFetch("/auth/register", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         ...formData,
    //         plan,
    //       }),
    //     });

    //     // ✅ STARTER → auto login → dashboard
    //     if (plan === "starter") {
    //       await refreshUser();
    //       router.replace("/dashboard");
    //       return;
    //     }

    //     // ✅ PRO / BUSINESS → go to payment
    //     router.replace(`/payment?plan=${plan}&billing=${billing}`);

    //   } catch (err: any) {
    //     setError(err.message || "Registration failed");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        plan,
      }),
    });

    // 🔥 ALWAYS go to payment page
    router.replace(`/payment?plan=${plan}&billing=${billing}`);

  } catch (err: any) {
    setError(err.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  /* ================= UI ================= */

  return (
    <div
      className={`${inter.className} min-h-screen flex items-center justify-center px-4 relative overflow-hidden 
      bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63]`}
    >
      {/* Glow Background */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[140px] rounded-full" />

      {/* Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 px-6 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-md"
      >
        ← Home
      </Link>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md 
        backdrop-blur-2xl 
        bg-white/10 
        border border-white/20 
        rounded-[24px] 
        shadow-[0_0_60px_rgba(0,0,0,0.4)] 
        p-12 
        text-white 
        space-y-6"
      >
        {/* Heading */}
        <h1
          className={`${playfair.className} text-5xl md:text-6xl leading-tight tracking-tight text-center`}
        >
          <span className="font-light block">
            Create your
          </span>
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
            Billing Power
          </span>
        </h1>

        {/* Plan Summary */}
        <div className="border border-white/20 rounded-xl p-4 text-sm bg-white/5">
          <div className="flex justify-between">
            <span>Plan</span>
            <span className="capitalize">{plan}</span>
          </div>
          <div className="flex justify-between">
            <span>Billing</span>
            <span className="capitalize">{billing}</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-3 mt-3 font-semibold text-purple-300">
            <span>Total</span>
            <span>₹{price}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />

          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-purple-500 to-pink-500 
            hover:scale-[1.03] hover:opacity-90 
            transition-all duration-300 
            shadow-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-300">
          Already have account?{" "}
          <Link
            href="/login"
            className="text-purple-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
