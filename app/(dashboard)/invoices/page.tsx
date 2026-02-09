"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  customer?: Customer | null;
  total: number;
  status: "PAID" | "PENDING"; // ✅ FIXED
  createdAt: string;
}

/* ================= PAGE ================= */

export default function InvoicesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  /* 📥 LOAD INVOICES */
  useEffect(() => {
    if (isAuthenticated) {
      loadInvoices();
    }
  }, [isAuthenticated]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Invoice[]>("/invoices");
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  /* 🗑️ DELETE INVOICE */
  const handleDelete = async (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation(); // ✅ IMPORTANT

    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await apiFetch(`/invoices/${id}`, { method: "DELETE" });
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Failed to delete invoice");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading invoices…</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>

        <button
          onClick={() => router.push("/billing")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          + New Invoice
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Invoice No</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => router.push(`/invoices/${inv.id}`)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4 font-mono">
                  {inv.invoiceNo}
                </td>

                <td className="p-4">
                  {inv.customer?.name ?? "—"}
                </td>

                <td className="p-4 font-semibold">
                  ₹{inv.total.toLocaleString("en-IN")}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>

                <td
                  className="p-4 text-right space-x-4"
                  onClick={(e) => e.stopPropagation()} // ✅ stop row click
                >
                  {/* VIEW */}
                  <button
                    onClick={() =>
                      router.push(`/invoices/${inv.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  {/* PAY NOW */}
                  {inv.status === "PENDING" && (
                    <button
                      onClick={() =>
                        router.push(`/invoices/${inv.id}`)
                      }
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Pay Now
                    </button>
                  )}

                  {/* DELETE */}
                  <button
                    onClick={(e) =>
                      handleDelete(e, inv.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-12 text-center text-gray-400"
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
