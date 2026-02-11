"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

/* ================= PLANS ================= */

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    users: 1,
    invoices: 5,
    features: ["Basic dashboard", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    users: 5,
    invoices: "Unlimited",
    features: ["Full analytics", "Priority support"],
  },
  {
    id: "business",
    name: "Business",
    price: 999,
    users: 10,
    invoices: "Unlimited",
    features: ["Automation", "Priority support", "Advanced reports"],
  },
] as const;

type PlanId = (typeof plans)[number]["id"];

export default function CompanySettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState<any>(null);
  const [currentPlan, setCurrentPlan] =
    useState<PlanId>("starter");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD COMPANY ================= */

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCompany = async () => {
      try {
        const data = await apiFetch<any>("/users/me");

        setCompany({
          company: data.company || "-",
          email: data.email || "-",
          gstNumber: data.gstNumber || "-",
          address: data.address || "-",
        });

        setCurrentPlan(data.plan || "starter");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

  return (
    <div className="space-y-12 max-w-6xl">
      {/* ================= COMPANY ================= */}
      <section>
        <h1 className="text-2xl font-bold mb-6">
          Company Overview
        </h1>

        {company && (
          <div className="bg-white border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
            <Info label="Company Name" value={company.company} />
            <Info label="Email" value={company.email} />
            <Info label="GST Number" value={company.gstNumber} />
            <Info label="Address" value={company.address} />
          </div>
        )}
      </section>

      {/* ================= PLAN SECTION ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Plan & Subscription
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const active = plan.id === currentPlan;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  active
                    ? "border-indigo-600 bg-indigo-50 shadow-lg"
                    : "border-gray-200 bg-white hover:shadow-md"
                }`}
              >
                {/* PLAN NAME */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">
                    {plan.name}
                  </h3>

                  {active && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>

                {/* PRICE */}
                <p className="text-3xl font-bold mb-5">
                  ₹{plan.price}
                  <span className="text-sm text-gray-500">
                    /month
                  </span>
                </p>

                {/* LIMIT DETAILS */}
                <div className="space-y-2 text-sm mb-5">
                  <Feature text={`${plan.users} User(s)`} />

                  <Feature
                    text={
                      typeof plan.invoices === "number"
                        ? `${plan.invoices} Invoices / Month`
                        : "Unlimited Invoices"
                    }
                  />

                  {plan.features.map((feature) => (
                    <Feature key={feature} text={feature} />
                  ))}
                </div>

                {/* BUTTON */}
                {active ? (
                  <button
                    disabled
                    className="w-full py-2 rounded bg-gray-200 text-gray-500"
                  >
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/upgrade?plan=${plan.id}`
                      )
                    }
                    className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ================= INFO COMPONENT ================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

/* ================= FEATURE COMPONENT ================= */

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <CheckCircle size={16} className="text-green-500" />
      <span>{text}</span>
    </div>
  );
}
