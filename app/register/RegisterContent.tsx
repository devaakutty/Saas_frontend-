"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/server/api";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({ subsets: ["latin"] });

type PlanId = "starter" | "pro" | "business";
type BillingCycle = "monthly" | "yearly";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.mobile || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.mobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (plan === "starter") {
        router.replace("/dashboard");
      } else {
        router.replace(`/payment?plan=${plan}&billing=${billing}`);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div
    className={`${inter.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] relative overflow-hidden px-4`}
  >
    {/* Softer Glow */}
    <div className="absolute top-[-150px] left-[-120px] w-[350px] h-[350px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

    <div className="relative z-10 w-full max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 rounded-[20px] shadow-2xl p-8 text-white">

      {/* Smaller Heading */}
      <h1
        className={`${playfair.className} text-3xl md:text-4xl font-light text-center mb-6`}
      >
        Create your
        <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Account
        </span>
      </h1>

      {/* Plan Summary */}
      <div className="border border-white/20 rounded-xl p-3 mb-5 text-xs bg-white/5">
        <div className="flex justify-between">
          <span>Plan</span>
          <span className="capitalize">{plan}</span>
        </div>
        <div className="flex justify-between">
          <span>Billing</span>
          <span className="capitalize">{billing}</span>
        </div>
        <div className="flex justify-between border-t border-white/20 pt-2 mt-2 font-semibold text-purple-300">
          <span>Total</span>
          <span>₹{price}</span>
        </div>
      </div>

      {error && (
        <p className="bg-red-500/20 text-red-300 text-xs p-2 rounded-lg mb-3 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          maxLength={10}
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-sm rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 shadow-lg"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-xs mt-5 text-gray-300">
        Already have account?{" "}
        <Link href="/login" className="text-purple-300 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
);
}