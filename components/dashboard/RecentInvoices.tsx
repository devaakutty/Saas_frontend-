"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

interface Invoice {
  _id: string;
  invoiceNo: string;
  total: number;
  status: "PAID" | "UNPAID";
  createdAt: string;
  customer?: {
    name: string;
  };
}

export default function RecentInvoices() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInvoices = async () => {
      try {
        const data = await apiFetch<Invoice[]>("/invoices");

        if (!isMounted) return;

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setInvoices(sorted.slice(0, 5));
      } catch (err: any) {
        if (!isMounted) return;

        // 🔐 Auth error handling
        if (err.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }

        setError(err.message || "Failed to load invoices");
        setInvoices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">
        Loading invoices…
      </div>
    );
  }

  /* ================= PLAN RESTRICTION ================= */

  if (error === "Upgrade to access analytics") {
    return (
      <div className="text-center space-y-3">
        <p className="text-gray-500 font-semibold">
          Invoice analytics available in Pro Plan
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  /* ================= GENERIC ERROR ================= */

  if (error) {
    return (
      <div className="text-red-400 text-sm">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recent Invoices</h3>
        <Link
          href="/dashboard/invoices"
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
              <tr
                key={inv._id}
                className="border-b last:border-none"
              >
                <td className="py-3 font-medium">
                  <Link
                    href={`/dashboard/invoices/${inv._id}`}
                    className="hover:underline"
                  >
                    {inv.invoiceNo}
                  </Link>
                </td>

                <td>{inv.customer?.name ?? "—"}</td>

                <td>
                  ₹{inv.total.toLocaleString()}
                </td>

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
