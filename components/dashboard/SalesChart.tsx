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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await apiFetch<Invoice[]>("/invoices");
      setInvoices(data);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

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
      <BarChart data={chartData} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
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
