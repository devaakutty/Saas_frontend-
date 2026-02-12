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

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9"];

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

        // Handle auth error
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
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading analytics…
      </div>
    );
  }

  /* ================= PLAN RESTRICTION ================= */

  if (error === "Upgrade to access analytics") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-gray-500 font-semibold">
          Analytics available in Pro Plan
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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

  /* ================= NO DATA ================= */

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No analytics data available
      </div>
    );
  }

  /* ================= CHART ================= */

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={45}
          outerRadius={95}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
