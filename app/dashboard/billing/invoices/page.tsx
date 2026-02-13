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
    <div className="relative px-6 pt-6 pb-12 text-white">

      {/* Main Rounded Container */}
      <div className="backdrop-blur-2xl 
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/20
        rounded-[32px]
        shadow-[0_0_60px_rgba(0,0,0,0.4)]
        p-8 space-y-8"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="font-[var(--font-playfair)] text-3xl font-light tracking-tight">
            Manage
            <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Invoices
            </span>
          </h1>

          <button
            onClick={() => router.push("/billing")}
            className="px-5 py-2.5 rounded-xl font-semibold 
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:scale-[1.03] transition-all duration-300 shadow-lg"
          >
            + New Invoice
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 opacity-70">
            Loading invoices...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && invoices.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-300 uppercase tracking-widest text-xs">
                <tr>
                  <th className="text-left p-4">Invoice</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-right p-4">Total</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-white/10 hover:bg-white/5 transition-all"
                  >
                    <td className="p-4 font-semibold">
                      {inv.invoiceNo}
                    </td>

                    <td className="p-4">
                      {inv.customer?.name}
                    </td>

                    <td className="p-4 text-gray-400">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right font-semibold">
                      ₹{inv.total.toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "PAID"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          router.push(`/invoices/${inv.id}`)
                        }
                        className="text-purple-300 hover:text-white transition-all"
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

        {/* EMPTY STATE */}
        {!loading && invoices.length === 0 && (
          <div className="text-center py-24 opacity-60">
            <p className="text-xl font-semibold">
              No invoices found
            </p>
            <p className="text-sm mt-2">
              Create your first invoice to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );

}
