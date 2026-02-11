"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

type Invoice = {
  id: string;
  invoiceNo: string;
  total: number;
  status: "PAID" | "PENDING";
  createdAt: string;
  customer: {
    name: string;
    phone?: string;
  };
};

/* ================= PAGE ================= */

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

    const loadInvoices = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Invoice[]>("/invoices");
        setInvoices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <button
          onClick={() => router.push("/billing")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          + New Invoice
        </button>
      </div>

      {/* STATES */}
      {loading && <p className="text-gray-500">Loading invoices...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* TABLE */}
      {!loading && invoices.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Invoice</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {inv.invoiceNo}
                  </td>

                  <td className="p-3">
                    {inv.customer?.name}
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    ₹{inv.total.toFixed(2)}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() =>
                        router.push(`/invoices/${inv.id}`)
                      }
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY */}
      {!loading && invoices.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">
            No invoices found
          </p>
          <p className="text-sm mt-1">
            Create your first invoice to get started
          </p>
        </div>
      )}
    </div>
  );
}
