"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */

interface Customer {
  id?: string;
  _id?: string;
  name: string;
}

interface Invoice {
  id?: string;
  _id?: string;
  invoiceNo: string;
  customer?: Customer | null;
  total: number;
  status: "PAID" | "PENDING";
  createdAt: string;
}

/* ================= PAGE ================= */

export default function InvoicesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedInvoiceNo, setEditedInvoiceNo] = useState("");

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

      const data = await apiFetch<any[]>("/invoices");

      const normalized = (data || []).map((inv) => ({
        ...inv,
        id: inv.id || inv._id,
      }));

      setInvoices(normalized);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  /* 🗑️ DELETE */
  const handleDelete = async (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();

    if (!confirm("Delete this invoice?")) return;

    try {
      await apiFetch(`/invoices/${id}`, {
        method: "DELETE",
      });

      setInvoices((prev) =>
        prev.filter((i) => i.id !== id)
      );
    } catch {
      alert("Failed to delete invoice");
    }
  };

  /* ✏️ UPDATE INVOICE NUMBER */
  const handleInvoiceNoUpdate = async (id: string) => {
    try {
      await apiFetch(`/invoices/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          invoiceNo: editedInvoiceNo,
        }),
      });

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? { ...inv, invoiceNo: editedInvoiceNo }
            : inv
        )
      );

      setEditingId(null);
    } catch {
      alert("Failed to update invoice number");
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center text-white/60">
        Loading invoices...
      </div>
    );
  }

  return (
    // <div className="px-8 py-10 text-white">
        <div className="relative px-1 pb-12 justify-top-0 mt-0">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold">
          Invoices
        </h1>

        <button
          onClick={() => router.push("/dashboard/billing")}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
        >
          + New Invoice
        </button>
      </div>

      {/* GLASS TABLE */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-white/10 border-b border-white/20 text-white/70">
            <tr>
              <th className="p-4 text-left">Invoice</th>
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
                onClick={() =>
                  router.push(`/dashboard/invoices/${inv.id}`)
                }
                className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
              >
                {/* ✏️ EDITABLE INVOICE NUMBER */}
                <td
                  className="p-4 font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  {editingId === inv.id ? (
                    <input
                      value={editedInvoiceNo}
                      autoFocus
                      onChange={(e) =>
                        setEditedInvoiceNo(e.target.value.toUpperCase())
                      }
                      onBlur={() =>
                        handleInvoiceNoUpdate(inv.id!)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleInvoiceNoUpdate(inv.id!);
                        }
                      }}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-40 focus:outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingId(inv.id!);
                        setEditedInvoiceNo(inv.invoiceNo);
                      }}
                      className="cursor-pointer hover:text-purple-300 transition"
                    >
                      {inv.invoiceNo}
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {inv.customer?.name ?? "—"}
                </td>

                <td className="p-4 font-semibold">
                  ₹{inv.total.toLocaleString("en-IN")}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "PAID"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      router.push(`/dashboard/invoices/${inv.id}`)
                    }
                    className="text-purple-300 hover:text-white transition"
                  >
                    View
                  </button>

                  <button
                    onClick={(e) =>
                      handleDelete(e, inv.id!)
                    }
                    className="text-red-400 hover:text-red-300 transition"
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
                  className="p-12 text-center text-white/40"
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
