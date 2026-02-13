"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */

interface Invoice {
  id: string;
  invoiceNo: string;
  total: number;
  createdAt: string;
  status: "PAID" | "UNPAID" | string;
  customer: {
    name: string;
  };
}

interface SalesResponse {
  invoices: Invoice[];
}

/* ================= PAGE ================= */

export default function SalesReportPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  /* 📥 LOAD SALES DATA */
  useEffect(() => {
    if (isAuthenticated) loadSalesReport();
  }, [isAuthenticated]);

  const loadSalesReport = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<SalesResponse>("/reports/sales");
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch (err: any) {
      setError(err.message || "Failed to load sales report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALCULATIONS ================= */

  const normalizeStatus = (status?: string) =>
    status?.toUpperCase() ?? "";

  const totalInvoices = invoices.length;

  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + inv.total,
    0
  );

  const paidInvoices = invoices.filter(
    (inv) => normalizeStatus(inv.status) === "PAID"
  );

  const unpaidInvoices = invoices.filter(
    (inv) => normalizeStatus(inv.status) === "UNPAID"
  );

  const paidRevenue = paidInvoices.reduce(
    (sum, inv) => sum + inv.total,
    0
  );

  const pendingAmount = unpaidInvoices.reduce(
    (sum, inv) => sum + inv.total,
    0
  );

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading sales report…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">{error}</div>
    );
  }
return (
  <div className="px-8 py-10">
    <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1b1f3a] via-[#24285f] to-[#2b2e63] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-purple-600/30 blur-[140px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-pink-500/20 blur-[120px] rounded-full" />

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
          Sales{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Report
          </span>
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <GlassCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          />
          <GlassCard
            title="Paid Revenue"
            value={`₹${paidRevenue.toLocaleString("en-IN")}`}
          />
          <GlassCard
            title="Pending Amount"
            value={`₹${pendingAmount.toLocaleString("en-IN")}`}
          />
          <GlassCard
            title="Total Invoices"
            value={totalInvoices}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-white">
            <thead className="bg-white/10 text-white/70">
              <tr>
                <th className="p-4 text-left">Invoice No</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-white/50">
                    No sales data available
                  </td>
                </tr>
              )}

              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="p-4 font-mono">{inv.invoiceNo}</td>

                  <td className="p-4">
                    {inv.customer?.name ?? "—"}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{inv.total.toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        normalizeStatus(inv.status) === "PAID"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {normalizeStatus(inv.status)}
                    </span>
                  </td>

                  <td className="p-4 text-white/70">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
);

}

/* ================= CARD ================= */
function GlassCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold text-white mt-2">
        {value}
      </p>
    </div>
  );
}
