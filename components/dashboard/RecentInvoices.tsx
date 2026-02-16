"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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

        setTotalCount(sorted.length);

        const isStarter = user?.plan === "starter";
        const invoiceLimit = 5; // starter default limit

        if (isStarter) {
          setInvoices(sorted.slice(0, invoiceLimit));
        } else {
          setInvoices(sorted);
        }

      } catch (err: any) {
        if (!isMounted) return;

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

    if (user) {
      loadInvoices();
    }

    return () => {
      isMounted = false;
    };
  }, [router, user]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">
        Loading invoices…
      </div>
    );
  }

  /* ================= ERROR ================= */

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
        <h3 className="font-semibold text-white">
          Recent Invoices
        </h3>

        <Link
          href="/dashboard/invoices"
          className="text-sm text-purple-400 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left py-2">Invoice</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv, index) => {
                const safeKey =
                  inv._id?.toString() ?? `invoice-${index}`;

                return (
                  <tr
                    key={safeKey}
                    className="border-b border-white/10 last:border-none hover:bg-white/5 transition"
                  >
                    <td className="py-3 font-medium text-white">
                      <Link
                        href={`/dashboard/invoices/${inv._id}`}
                        className="hover:text-purple-400 transition"
                      >
                        {inv.invoiceNo}
                      </Link>
                    </td>

                    <td className="text-white/70">
                      {inv.customer?.name ?? "—"}
                    </td>

                    <td className="text-white">
                      ₹{inv.total.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          inv.status === "PAID"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-white/50"
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= STARTER LIMIT MESSAGE ================= */}

      {user?.plan === "starter" && totalCount > 5 && (
        <div className="text-center mt-6">
          <p className="text-sm text-white/60 mb-3">
            You’ve reached your Starter plan limit (5 invoices).
          </p>

          <button
            onClick={() =>
              router.push("/dashboard/settings/company")
            }
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition"
          >
            🚀 Upgrade Plan
          </button>
        </div>
      )}
    </div>
  );
}
