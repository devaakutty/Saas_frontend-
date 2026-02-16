"use client";

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
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (!isAuthenticated && !loading) {
    router.replace("/login");
    return null;
  }

  if (loading || !user) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

  const currentPlan: PlanId = user.plan || "starter";

  return (
    <div className="space-y-16 text-white max-w-6xl">

      {/* ================= COMPANY OVERVIEW ================= */}
      <section className="space-y-6">
        <h1 className="text-2xl">
          Company{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Overview
          </span>
        </h1>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassInfo label="Company Name" value={user.company || "-"} />
          <GlassInfo label="Email" value={user.email || "-"} />
          <GlassInfo label="GST Number" value={user.gstNumber || "-"} />
          <GlassInfo label="Address" value={user.address || "-"} />
        </div>
      </section>

      {/* ================= PLAN SECTION ================= */}
      <section className="space-y-8">
        <h2 className="text-2xl">
          Plan &{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Subscription
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const active = plan.id === currentPlan;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-10 border backdrop-blur-md transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 shadow-xl shadow-purple-500/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {plan.name}
                  </h3>

                  {active && (
                    <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-4xl font-semibold mb-6">
                  ₹{plan.price}
                  <span className="text-sm text-white/60 ml-1">
                    /month
                  </span>
                </p>

                <div className="space-y-3 text-sm mb-8">
                  <GlassFeature text={`${plan.users} User(s)`} />

                  <GlassFeature
                    text={
                      typeof plan.invoices === "number"
                        ? `${plan.invoices} Invoices / Month`
                        : "Unlimited Invoices"
                    }
                  />

                  {plan.features.map((feature) => (
                    <GlassFeature key={feature} text={feature} />
                  ))}
                </div>

                {active ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-white/10 text-white/50"
                  >
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      router.push(`/dashboard/upgrade?plan=${plan.id}`)
                    }
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
                  >
                    Upgrade Plan
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

/* ================= INFO ================= */

function GlassInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

/* ================= FEATURE ================= */

function GlassFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/80">
      <CheckCircle size={16} className="text-purple-400" />
      <span>{text}</span>
    </div>
  );
}
