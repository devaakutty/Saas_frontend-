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
    <div className="space-y-6">
      {/* BACK */}
      <button
        onClick={() => router.push("/reports")}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-100"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">Sales Report</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
        />
        <Card
          title="Paid Revenue"
          value={`₹${paidRevenue.toLocaleString("en-IN")}`}
        />
        <Card
          title="Pending (Unpaid) Amount"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
        />
        <Card
          title="Total Invoices"
          value={totalInvoices}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Invoice No</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No sales data available
                </td>
              </tr>
            )}

            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-mono">
                  {inv.invoiceNo}
                </td>

                <td className="p-3">
                  {inv.customer?.name ?? "—"}
                </td>

                <td className="p-3 font-semibold">
                  ₹{inv.total.toLocaleString("en-IN")}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      normalizeStatus(inv.status) === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {normalizeStatus(inv.status)}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
