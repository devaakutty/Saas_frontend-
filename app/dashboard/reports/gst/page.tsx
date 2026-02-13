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
  <div className="px-10 py-12">

    {/* Rounded Main Container */}
    <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-purple-500/30 blur-[150px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-pink-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 space-y-20">
        <button
  onClick={() => router.push("/dashboard/reports")}
  className="group inline-flex items-center gap-2 px-6 py-3 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
>
  <span className="transition-transform duration-300 group-hover:-translate-x-1">
    ←
  </span>
  <span className="font-[var(--font-inter)] text-sm tracking-wide">
    Back to Reports
  </span>
</button>


        {/* HERO */}
        <div className="max-w-4xl">
          <h1 className="font-[var(--font-playfair)] text-[64px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-tight text-white">
            GST{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Report
            </span>
          </h1>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CleanCard title="Taxable Sales" value={data.taxableSales} />
          <CleanCard title="Output GST" value={data.outputGST} />
          <CleanCard title="Input GST" value={data.inputGST} />
          <CleanCard title="Net GST" value={data.netGST} highlight />
        </div>

        {/* CHART */}
        <div className="bg-white/5 backdrop-blur-md rounded-[20px] p-8 border border-white/10 h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid stroke="#ffffff15" />
              <XAxis dataKey="month" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip />
              <Legend />

              <Bar dataKey="input" fill="#6366f1" radius={[6,6,0,0]} />
              <Bar dataKey="output" fill="#22c55e" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="bg-white/5 backdrop-blur-md rounded-[20px] border border-white/10 overflow-hidden">
          <table className="w-full text-sm text-white">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-center">Taxable</th>
                <th className="p-4 text-center">Output</th>
                <th className="p-4 text-center">Input</th>
                <th className="p-4 text-center">Net</th>
              </tr>
            </thead>

            <tbody>
              {data.monthly.map((row) => {
                const net = row.output - row.input;

                return (
                  <tr
                    key={row.month}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4">{row.month}</td>
                    <td className="p-4 text-center">
                      ₹{row.taxable.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-center text-green-400">
                      ₹{row.output.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-center text-indigo-400">
                      ₹{row.input.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-center font-semibold text-red-400">
                      ₹{net.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
);


}

/* ================= SUMMARY CARD ================= */
function CleanCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 transition hover:bg-white/10">
      <p className="font-[var(--font-inter)] text-white/60 text-sm">
        {title}
      </p>
      <p
        className={`font-[var(--font-playfair)] text-3xl mt-2 ${
          highlight ? "text-red-400" : "text-white"
        }`}
      >
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

