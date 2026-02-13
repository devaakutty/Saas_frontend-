"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= DYNAMIC RECHARTS (SSR FIX) ================= */

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("recharts").then((m) => m.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((m) => m.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);

/* ================= TYPES ================= */

type MonthlyRow = {
  month: string;
  revenue: number;
  expense: number;
};

type ProfitLossResponse = {
  revenue: number;
  cost: number;
  profit: number;
  monthly: MonthlyRow[];
};

/* ================= PAGE ================= */

export default function ProfitLossPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<ProfitLossResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  /* 📥 LOAD REPORT */
  useEffect(() => {
    if (isAuthenticated) loadReport();
  }, [isAuthenticated]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<ProfitLossResponse>(
        "/reports/profit-loss"
      );

      setData({
        ...res,
        monthly: Array.isArray(res.monthly) ? res.monthly : [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading profit & loss report…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        {error || "No data available"}
      </div>
    );
  }

  /* ================= UI ================= */

/* ================= UI ================= */

return (
  <div className="px-8 py-10 min-h-screen overflow-y-auto">

    <div className="relative rounded-[32px] bg-gradient-to-br from-[#1b1f3a] via-[#24285f] to-[#2b2e63] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-purple-600/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-pink-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-12">

        {/* BACK */}
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="text-white/60 hover:text-white transition text-sm"
        >
          ← Back
        </button>

        {/* TITLE */}
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-tight text-white">
          Profit &{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Loss
          </span>
        </h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassSummary
            title="Total Revenue"
            value={data.revenue}
            color="green"
          />
          <GlassSummary
            title="Total Expense"
            value={data.cost}
            color="red"
          />
          <GlassSummary
            title="Net Profit"
            value={Math.max(data.profit, 0)}
            color="indigo"
          />
        </div>

        {/* CHART */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold">
              Revenue vs Expense
            </h3>
            <span className="text-sm text-white/60">
              Last {data.monthly.length} months
            </span>
          </div>

          {data.monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={data.monthly}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fill="url(#rev)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  fill="url(#exp)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/50">
              No chart data available
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-white">
            <thead className="bg-white/10 text-white/70">
              <tr>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-center">Revenue</th>
                <th className="p-4 text-center">Expense</th>
                <th className="p-4 text-center">Profit</th>
              </tr>
            </thead>

            <tbody>
              {data.monthly.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-white/50">
                    No data available
                  </td>
                </tr>
              ) : (
                data.monthly.map((row) => {
                  const profit = row.revenue - row.expense;

                  return (
                    <tr
                      key={row.month}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-4 font-medium">
                        {row.month}
                      </td>
                      <td className="p-4 text-center">
                        ₹{row.revenue.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center">
                        ₹{row.expense.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center font-semibold text-green-400">
                        ₹{profit.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
);

}

/* ================= CARD ================= */

function GlassSummary({
  title,
  value = 0,
  color,
}: {
  title: string;
  value?: number;
  color: "green" | "red" | "indigo";
}) {
  const colorMap = {
    green: "text-green-400",
    red: "text-red-400",
    indigo: "text-indigo-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
      <p className="text-sm text-white/60">{title}</p>
      <p className={`text-3xl font-semibold mt-2 ${colorMap[color]}`}>
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

