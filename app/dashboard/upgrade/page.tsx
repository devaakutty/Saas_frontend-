"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

/* ================= PLAN DATA ================= */

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    users: 1,
    invoices: "5 invoices / month",
    features: ["Basic Dashboard", "Email Support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    users: 5,
    invoices: "Unlimited invoices",
    features: ["Analytics Dashboard", "Priority Support"],
  },
  {
    id: "business",
    name: "Business",
    price: 999,
    users: 10,
    invoices: "Unlimited invoices",
    features: ["Custom Branding", "AI Insights", "24/7 Support"],
  },
];

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPlanId = searchParams.get("plan") || "starter";
  const currentIndex = plans.findIndex(
    (p) => p.id === currentPlanId
  );

  return (
    <div className="relative min-h-screen bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] text-white overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 blur-[160px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/20 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-[120px] space-y-20">

        {/* ================= HERO ================= */}
        <div className="text-center max-w-4xl mx-auto">

          <h1 className="font-[var(--font-playfair)] text-[64px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-tight">
            <span className="font-light block">
              Improve your
            </span>
            <span className="font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Billing Power
            </span>
          </h1>

          <p className="font-[var(--font-inter)] mt-6 text-lg text-white/70">
            Upgrade your plan to unlock analytics, automation,
            and advanced business tools.
          </p>
        </div>

        {/* ================= PLANS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {plans.map((plan, index) => {
            const isCurrent = index === currentIndex;
            const isDowngrade = index < currentIndex;
            const isUpgrade = index > currentIndex;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[24px] p-10 backdrop-blur-xl border border-white/20 bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 ${
                  isCurrent ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* Badge */}
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1 rounded-full">
                    Current Plan
                  </div>
                )}

                <h2 className="text-2xl font-semibold mb-3">
                  {plan.name}
                </h2>

                <p className="text-4xl font-bold text-primary mb-6">
                  ₹{plan.price}
                  <span className="text-base text-white/60 ml-2">
                    /mo
                  </span>
                </p>

                <ul className="space-y-3 text-white/70 text-sm mb-8">
                  <Feature text={`${plan.users} Users`} />
                  <Feature text={plan.invoices} />
                  {plan.features.map((f) => (
                    <Feature key={f} text={f} />
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (isDowngrade) return;

                    router.push(
                      `/payment?plan=${plan.id}&billing=monthly`
                    );
                  }}
                  className={`w-full py-3 rounded-[18px] font-semibold transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary text-white hover:bg-primary/80"
                      : isUpgrade
                      ? "bg-gradient-to-r from-primary to-primary/70 text-white hover:opacity-90"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {isCurrent
                    ? "Manage Plan"
                    : isUpgrade
                    ? "Upgrade Now"
                    : "Not Available"}
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

/* ================= FEATURE ================= */

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle size={16} className="text-primary" />
      <span>{text}</span>
    </li>
  );
}
