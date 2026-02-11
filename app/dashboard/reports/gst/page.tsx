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
const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((m) => m.Bar),
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
const Legend = dynamic(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
);

/* ================= TYPES ================= */

type MonthlyGST = {
  month: string;
  taxable: number;
  output: number;
  input: number;
};

type GSTResponse = {
  taxableSales: number;
  outputGST: number;
  inputGST: number;
  netGST: number;
  monthly: MonthlyGST[];
};

/* ================= PAGE ================= */

export default function GSTReportPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<GSTResponse>({
    taxableSales: 0,
    outputGST: 0,
    inputGST: 0,
    netGST: 0,
    monthly: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  /* 📥 LOAD GST REPORT */
  useEffect(() => {
    if (isAuthenticated) loadGST();
  }, [isAuthenticated]);

  const loadGST = async () => {
    try {
      setLoading(true);

      // ✅ CORRECT PATH
      const res = await apiFetch<GSTResponse>("/reports/gst");

      setData({
        taxableSales: res.taxableSales ?? 0,
        outputGST: res.outputGST ?? 0,
        inputGST: res.inputGST ?? 0,
        netGST: res.netGST ?? 0,
        monthly: Array.isArray(res.monthly) ? res.monthly : [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to load GST report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-6 text-gray-500">Loading GST report…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button
        onClick={() => router.push("/reports")}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">GST Report</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <SummaryCard title="Taxable Sales" value={data.taxableSales} />
        <SummaryCard title="Output GST" value={data.outputGST} />
        <SummaryCard title="Input GST" value={data.inputGST} />
        <SummaryCard title="Net GST Payable" value={data.netGST} highlight />
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-xl p-6 h-[340px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">GST Comparison (Monthly)</h3>
          <span className="text-sm text-gray-500">
            Last {data.monthly.length} months
          </span>
        </div>

        {data.monthly.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No GST data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="input"
                name="Input GST"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="output"
                name="Output GST"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-center">Taxable</th>
              <th className="p-3 text-center">Output GST</th>
              <th className="p-3 text-center">Input GST</th>
              <th className="p-3 text-center">Net GST</th>
            </tr>
          </thead>
          <tbody>
            {data.monthly.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No GST data available
                </td>
              </tr>
            ) : (
              data.monthly.map((row) => {
                const net = row.output - row.input;
                return (
                  <tr key={row.month} className="border-t">
                    <td className="p-3 font-medium">{row.month}</td>
                    <td className="p-3 text-center">
                      ₹{row.taxable.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center text-green-600">
                      ₹{row.output.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center text-indigo-600">
                      ₹{row.input.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-center font-semibold text-red-600">
                      ₹{net.toLocaleString("en-IN")}
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

/* ================= SUMMARY CARD ================= */

function SummaryCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 ${
        highlight ? "border-red-500" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          highlight ? "text-red-600" : ""
        }`}
      >
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
