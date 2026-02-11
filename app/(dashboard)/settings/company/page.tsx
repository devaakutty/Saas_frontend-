"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= PLANS (MATCH BACKEND) ================= */

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    features: ["1 user", "10 invoices", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    features: ["5 users", "Unlimited invoices", "Priority support"],
  },
  {
    id: "business",
    name: "Business",
    price: 999,
    features: ["10 users", "AI insights", "24/7 support"],
  },
] as const;

type PlanId = (typeof plans)[number]["id"];

/* ================= PAGE ================= */

export default function CompanySettingsPage() {
  const { isAuthenticated } = useAuth();

  // const [company, setCompany] = useState<any>(null);
  const [currentPlan, setCurrentPlan] =
    useState<PlanId>("starter");

  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ================= PAYMENT STATE ================= */

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<(typeof plans)[number] | null>(null);
  const [paying, setPaying] = useState(false);
    const [company, setCompany] = useState<any>({
    company: "-",
    email: "-",
    gstNumber: "-",
    address: "-",
  });


  /* ================= LOAD COMPANY + PLAN ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingProfile(false);
      return;
    }

    loadCompany();
  }, [isAuthenticated]);

  const loadCompany = async () => {
    try {
      setLoadingProfile(true);

      const data = await apiFetch<any>("/users/me");

      setCompany({
        company: data.company || "-",
        email: data.email || "-",
        gstNumber: data.gstNumber || "-",
        address: data.address || "-",
      });

      // 🔥 REAL SOURCE OF TRUTH
      setCurrentPlan(data.plan || "starter");
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ================= PAYMENT ================= */

  const openPayment = (plan: (typeof plans)[number]) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const confirmPayment = async () => {
    if (!selectedPlan) return;

    try {
      setPaying(true);

      // 🔥 REAL BACKEND UPGRADE
      await apiFetch("/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          plan: selectedPlan.id,
        }),
      });

      setShowPayment(false);
      await loadCompany(); // refresh plan from backend

      alert("🎉 Plan upgraded successfully!");
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  /* ================= UI STATES ================= */

  if (loadingProfile) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-gray-400">
        Please log in to view company settings.
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-10 max-w-5xl">
      {/* ================= COMPANY ================= */}
      <section>
        <h1 className="text-2xl font-bold text-white mb-4">
          Company Overview
        </h1>

      {company && (
        <div className="bg-[#0e1117] border border-white/20 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Company Name" value={company.company} />
          <Info label="Email" value={company.email} />
          <Info label="GST Number" value={company.gstNumber} />
          <Info label="Address" value={company.address} />
        </div>
      )}
      </section>

      {/* ================= PLANS ================= */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">
          Plan & Subscription
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const active = plan.id === currentPlan;

            return (
              <div
                key={plan.id}
                className={`rounded-xl p-6 border ${
                  active
                    ? "bg-indigo-500/10 border-indigo-500"
                    : "bg-[#11141c] border-white/10"
                }`}
              >
                <h3 className="font-semibold text-white">
                  {plan.name}
                </h3>

                <p className="text-3xl font-bold text-white my-2">
                  ₹{plan.price}
                  <span className="text-sm text-gray-400">
                    /month
                  </span>
                </p>

                <ul className="text-sm text-gray-400 space-y-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                {active ? (
                  <button
                    disabled
                    className="w-full py-2 rounded bg-white/10 text-gray-400"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => openPayment(plan)}
                    className="w-full py-2 rounded bg-indigo-500 hover:bg-indigo-600"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PAYMENT MODAL ================= */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0e1117] rounded-xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Upgrade to {selectedPlan.name}
            </h3>

            <p className="text-white text-lg mb-6">
              Amount:{" "}
              <span className="font-bold">
                ₹{selectedPlan.price}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-2 rounded bg-white/10 text-white"
              >
                Cancel
              </button>

              <button
                disabled={paying}
                onClick={confirmPayment}
                className="flex-1 py-2 rounded bg-indigo-500 hover:bg-indigo-600"
              >
                {paying ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INFO ================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
