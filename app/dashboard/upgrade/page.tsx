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
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 mt-2">
            Current Plan:{" "}
            <span className="font-semibold">
              {plans[currentIndex]?.name}
            </span>
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isCurrent = index === currentIndex;
            const isDowngrade = index < currentIndex;
            const isUpgrade = index > currentIndex;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 border-2 bg-white transition-all ${
                  isCurrent
                    ? "border-green-500 shadow-lg"
                    : isUpgrade
                    ? "border-indigo-600 shadow-xl hover:scale-105"
                    : "border-gray-200 opacity-70"
                }`}
              >
                {/* BADGE */}
                {isCurrent && (
                  <Badge color="green">Current Plan</Badge>
                )}
                {isUpgrade && (
                  <Badge color="indigo">Upgrade 🚀</Badge>
                )}
                {isDowngrade && (
                  <Badge color="gray">Downgrade Locked</Badge>
                )}

                <h2 className="text-xl font-bold mb-2">
                  {plan.name}
                </h2>

                <p className="text-4xl font-bold text-indigo-600">
                  ₹{plan.price}
                  <span className="text-base text-gray-500">
                    /mo
                  </span>
                </p>

                <div className="mt-6 space-y-3 text-sm">
                  <Feature text={`${plan.users} Users`} />
                  <Feature text={plan.invoices} />
                  {plan.features.map((f) => (
                    <Feature key={f} text={f} />
                  ))}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    if (isDowngrade) return;

                    // ✅ Correct route based on your folder
                    router.push(
                      `/payment?plan=${plan.id}&billing=monthly`
                    );
                  }}
                  className={`mt-8 w-full py-3 rounded-lg font-semibold transition ${
                    isCurrent
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : isUpgrade
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-500"
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

/* ================= BADGE ================= */

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "indigo" | "gray";
}) {
  const styles = {
    green: "bg-green-600",
    indigo: "bg-indigo-600",
    gray: "bg-gray-400",
  };

  return (
    <div
      className={`text-xs text-white px-3 py-1 rounded-full inline-block mb-3 ${styles[color]}`}
    >
      {children}
    </div>
  );
}

/* ================= FEATURE ================= */

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <CheckCircle size={16} className="text-green-500" />
      <span>{text}</span>
    </div>
  );
}
