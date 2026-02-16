"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

type Invoice = {
  status: "PAID" | "UNPAID";
  total: number;
  createdAt: string;
};

type ChartPoint = {
  month: string;
  timestamp: number;
  sales: number;
  pending: number;
};

export default function SalesChart() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInvoices = async () => {
      try {
        const data = await apiFetch<Invoice[]>("/invoices");

        if (!isMounted) return;

        setInvoices(data ?? []);
      } catch (err: any) {
        if (!isMounted) return;

        // 🔐 Handle auth error
        if (err.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }

        setError(err.message || "Failed to load sales data");
        setInvoices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ================= PROCESS DATA ================= */

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!invoices.length) return [];

    const map: Record<string, ChartPoint> = {};

    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      });

      if (!map[key]) {
        map[key] = {
          month: label,
          timestamp: new Date(
            d.getFullYear(),
            d.getMonth(),
            1
          ).getTime(),
          sales: 0,
          pending: 0,
        };
      }

      if (inv.status === "PAID") {
        map[key].sales += inv.total;
      } else {
        map[key].pending += inv.total;
      }
    });

    return Object.values(map).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, [invoices]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading sales data…
      </div>
    );
  }

  /* ================= PLAN RESTRICTION ================= */

  if (error === "Upgrade to access analytics") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-white/80 font-semibold text-lg">
          Sales analytics available in Pro Plan
        </p>
        <button
          onClick={() => router.push("/dashboard/settings/company")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-6 py-2 rounded-xl transition shadow-lg"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  /* ================= GENERIC ERROR ================= */

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 text-sm">
        {error}
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!chartData.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No sales data available
      </div>
    );
  }

  /* ================= CHART ================= */

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barGap={3} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3"  />
        <YAxis
          stroke="rgba(255,255,255,0.4)"
          tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
        />

        <XAxis
          stroke="rgba(255,255,255,0.4)"
          tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
        />

        <Tooltip
          formatter={(value) =>
            typeof value === "number"
              ? `₹${value.toLocaleString()}`
              : value
          }
        />
        <Legend />
        <Bar
          dataKey="sales"
          name="Sales"
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="pending"
          name="Pending"
          fill="#f59e0b"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
