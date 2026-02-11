"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

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

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  /* ================= PLAN FROM URL ================= */

  const plan =
    (searchParams.get("plan") as PlanId) || "starter";

  const billing =
    (searchParams.get("billing") as BillingCycle) ||
    "monthly";

  const price = PLAN_PRICES[plan][billing];

  /* ================= FORM STATE ================= */

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidMobile = /^[0-9]{10}$/;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidMobile.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    if (!isValidEmail.test(formData.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          plan,
          billing,
        }),
      });

      await login();

      // 🔥 If paid plan → go to payment page
      if (plan !== "starter") {
        router.push(
          `/payment?plan=${plan}&billing=${billing}`
        );
      } else {
        router.replace("/dashboard");
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

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        {/* ================= PLAN SUMMARY ================= */}
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
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number (10 digits)"
            required
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
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center">
          Already have account?{" "}
          <Link
            href="/login"
            className="text-indigo-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
