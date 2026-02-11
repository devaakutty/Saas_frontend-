"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";

type Invoice = {
  status: "PAID" | "UNPAID";
  total: number;
  createdAt: string;
};

type ChartPoint = {
  date: string;
  timestamp: number;
  received: number;
  pending: number;
};

export default function PaymentsChart({
  invoices = [],
}: {
  invoices?: Invoice[];
}) {
  const chartData = useMemo<ChartPoint[]>(() => {
    if (!invoices.length) return [];

    const map: Record<string, ChartPoint> = {};

    invoices.forEach((inv) => {
      if (!inv.createdAt) return;

      const dateObj = new Date(inv.createdAt);
      if (isNaN(dateObj.getTime())) return;

      const label = dateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!map[label]) {
        map[label] = {
          date: label,
          timestamp: dateObj.getTime(),
          received: 0,
          pending: 0,
        };
      }

      if (inv.status === "PAID") {
        map[label].received += inv.total;
      } else {
        map[label].pending += inv.total;
      }
    });

    return Object.values(map).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, [invoices]);

  /* ================= EMPTY STATE ================= */

  if (!chartData.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No payment data available
      </div>
    );
  }

  /* ================= CHART ================= */

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
          <Tooltip
          formatter={(value: any) =>
            typeof value === "number"
              ? `₹${value.toLocaleString()}`
              : value
          }
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="received"
          name="Received"
          stroke="#22c55e"
          strokeWidth={3}
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="pending"
          name="Pending"
          stroke="#ef4444"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
