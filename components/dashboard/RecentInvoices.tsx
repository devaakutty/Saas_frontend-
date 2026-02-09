"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

interface Invoice {
  id: string;
  invoiceNo: string;
  total: number;
  status: "PAID" | "UNPAID";
  createdAt: string;
  customer: {
    name: string;
  };
}

export default function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await apiFetch<Invoice[]>("/invoices");
      setInvoices(data.slice(0, 5)); // ✅ latest 5
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">
        Loading invoices…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recent Invoices</h3>
        <Link
          href="/invoices"
          className="text-sm text-indigo-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b last:border-none">
                <td className="py-3 font-medium">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="hover:underline"
                  >
                    {inv.invoiceNo}
                  </Link>
                </td>

                <td>{inv.customer?.name ?? "—"}</td>


                <td>₹{inv.total.toLocaleString()}</td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400"
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
