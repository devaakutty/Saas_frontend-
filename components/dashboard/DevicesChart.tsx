"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";
import { useRouter } from "next/navigation";

export default function DevicesChart() {
  const router = useRouter();

  const [data, setData] = useState<
    { name: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async () => {
      try {
        const res = await apiFetch<
          { device: string; count: number }[]
        >("/dashboard/devices");

        if (!isMounted) return;

        setData(
          res.map((r) => ({
            name: r.device,
            value: r.count,
          }))
        );
      } catch (err: any) {
        if (!isMounted) return;

        if (err.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }

        setError(err.message || "Failed to load analytics");
        setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDevices();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white/60 text-sm">
        Loading analytics…
      </div>
    );
  }

  /* ================= PLAN LOCK ================= */

  if (error === "Upgrade to access analytics") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
      <p className="text-white/80 font-semibold text-lg">
        Stock Analytics Available in Pro Plan
      </p>

        <button
          onClick={() => router.push("/dashboard/settings/company")}
          className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-xl transition shadow-lg"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  /* ================= GENERIC ERROR ================= */

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-400 text-sm">
        {error}
      </div>
    );
  }

  /* ================= NO DATA ================= */

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-white/50 text-sm">
        No analytics data available
      </div>
    );
  }

  /* ================= DYNAMIC COLORS ================= */

  const primaryColor = "rgb(var(--primary))";

const COLORS = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#A855F7", // Violet
   "#7C3AED",
  "#DB2777",
  "#0891B2",
  "#D97706",
  "#059669",
  "#DC2626",
  "#2563EB",
  "#9333EA",
];


  /* ================= CHART ================= */

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            background: "#1147bb",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
