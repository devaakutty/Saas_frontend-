"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/server/api";

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
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= READ PLAN FROM URL ================= */

  useEffect(() => {
    const rawPlan = searchParams.get("plan");
    const rawBilling = searchParams.get("billing");

    if (rawPlan === "pro" || rawPlan === "business") {
      setPlan(rawPlan);
    } else {
      setPlan("starter");
    }

    if (rawBilling === "yearly") {
      setBilling("yearly");
    } else {
      setBilling("monthly");
    }
  }, [searchParams]);

  const price = PLAN_PRICES[plan][billing];

  /* ================= INPUT HANDLER ================= */

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

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.mobile.length !== 10) {
        setError("Mobile number must be exactly 10 digits");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Enter a valid email address");
        return;
    }

    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }

    try {
        setLoading(true);

        // ✅ SEND CORRECT FIELDS
        await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password,
        }),
        });

        // 🔥 No need auto-login because backend already sets cookie
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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        <Link
          href="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Home
        </Link>

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between">
            <span>Selected Plan</span>
            <span className="font-semibold capitalize">
              {plan}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Billing</span>
            <span className="font-semibold capitalize">
              {billing}
            </span>
          </div>

          <div className="flex justify-between border-t pt-2 mt-2">
            <span>Total</span>
            <span className="text-indigo-600 font-bold">
              ₹{price}
            </span>
          </div>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number (10 digits)"
            required
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center">
          Already have account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
