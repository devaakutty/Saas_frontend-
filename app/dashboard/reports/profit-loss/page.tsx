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

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/reports")}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">Profit & Loss Report</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard
          title="Total Revenue"
          value={data.revenue}
          color="green"
        />
        <SummaryCard
          title="Total Expense"
          value={data.cost}
          color="red"
        />
        <SummaryCard
          title="Net Profit"
          value={Math.max(data.profit, 0)}
          color="indigo"
        />
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-xl p-6 h-[340px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Revenue vs Expense</h3>
          <span className="text-sm text-gray-500">
            Last {data.monthly.length} months
          </span>
        </div>

        {data.monthly.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
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

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fill="url(#rev)"
                strokeWidth={3}
                name="Revenue"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fill="url(#exp)"
                strokeWidth={3}
                name="Expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No chart data available
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-center">Revenue</th>
              <th className="p-3 text-center">Expense</th>
              <th className="p-3 text-center">Profit</th>
            </tr>
          </thead>

          <tbody>
            {data.monthly.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.monthly.map((row) => {
                const profit = row.revenue - row.expense;
                return (
                  <tr key={row.month} className="border-t">
                    <td className="p-3 font-medium">{row.month}</td>
                    <td className="p-3 text-center">
                      ₹{row.revenue.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center">
                      ₹{row.expense.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center font-semibold text-green-600">
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
  );
}

/* ================= CARD ================= */

function SummaryCard({
  title,
  value = 0,
  color,
}: {
  title: string;
  value?: number;
  color: "green" | "red" | "indigo" | "gray";
}) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    indigo: "text-indigo-600",
    gray: "text-gray-600",
  };

  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${colorMap[color]}`}>
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
