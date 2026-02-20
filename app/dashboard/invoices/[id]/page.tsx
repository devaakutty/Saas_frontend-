"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

import PaymentMethod, {
  PaymentMethodType,
  PaymentDetails,
} from "@/components/billing/PaymentMethod";

/* ================= TYPES ================= */

interface InvoiceItem {
  productName: string;
  qty?: number;
  quantity?: number;
  rate: number;
  amount?: number;
}

interface Invoice {
  _id: string;
  invoiceNo: string;
  status: "PAID" | "PENDING";
  total: number;
  createdAt: string;
  customer: {
    name: string;
    phone?: string;
  } | null;
  items: InvoiceItem[];
}

/* ================= PAGE ================= */

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  /* ================= LOAD INVOICE ================= */

  useEffect(() => {
    if (!invoiceId) return;

    const loadInvoice = async () => {
      try {
        const data = await apiFetch<Invoice>(
          `/invoices/${invoiceId}`
        );
        setInvoice(data);
      } catch (err) {
        console.error(err);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  if (loading) {
    return <div className="p-6">Loading invoice…</div>;
  }

  if (!invoice) {
    return <div className="p-6">Invoice not found</div>;
  }

  /* ================= SAFE CALCULATIONS ================= */

  const items = invoice.items || [];

  const subTotal = items.reduce((sum, item) => {
    const qty = item.qty ?? item.quantity ?? 0;
    const amount =
      item.amount ?? qty * item.rate;
    return sum + amount;
  }, 0);

  const GST_RATE = 0.18;
  const gstAmount = subTotal * GST_RATE;
  const grandTotal = subTotal + gstAmount;

  /* ================= PAYMENT ================= */

  const handlePayment = async (
    method: PaymentMethodType,
    details: PaymentDetails
  ) => {
    try {
      setPaying(true);

      await apiFetch(`/invoices/${invoice._id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "PAID",
          payment: {
            method,
            ...details,
          },
        }),
      });

      // alert("Payment successful ✅");.
          setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);

      setInvoice((prev) =>
        prev ? { ...prev, status: "PAID" } : prev
      );

      router.push("/dashboard/billing");

    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  /* ================= DOWNLOAD PDF ================= */

  const handleDownload = async () => {
    try {
      const blob = await apiFetch<Blob>(
        `/invoices/${invoice._id}/pdf`,
        { method: "GET" },
        "blob"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${invoice.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      alert(err.message || "Invoice download failed");
    }
  };

  /* ================= UI ================= */

return (
  <div className="px-10 py-12">

    <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-purple-500/30 blur-[150px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-pink-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-4xl space-y-12 text-white">

        {/* Back */}
        <button
          onClick={() => router.push("/dashboard/invoices")}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          ← Back to Invoices
        </button>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-[var(--font-playfair)] text-[34px] leading-[0.95] tracking-tight">
            Invoice{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {invoice.invoiceNo}
            </span>
          </h1>

          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              invoice.status === "PAID"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Customer Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 space-y-2">
          <p>
            <span className="text-white/60">Customer:</span>{" "}
            {invoice.customer?.name || "—"}
          </p>
          <p>
            <span className="text-white/60">Date:</span>{" "}
            {new Date(invoice.createdAt).toDateString()}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 space-y-3">
          {items.map((item, i) => {
            const qty = item.qty ?? item.quantity ?? 0;
            const amount = item.amount ?? qty * item.rate;

            return (
              <div
                key={`${item.productName}-${i}`}
                className="flex justify-between"
              >
                <span>
                  {item.productName} × {qty}
                </span>
                <span>
                  ₹{amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/60">Sub Total</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/60">GST (18%)</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold mt-3">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 space-y-4">

          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-[20px] bg-white/10 hover:bg-white/20 transition"
          >
            Download Invoice (PDF)
          </button>
                        {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 
                              rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
                {successMessage}
              </div>
            )}

          {invoice.status === "PENDING" && (
            <PaymentMethod
              total={grandTotal}
              loading={paying}
              onConfirm={handlePayment}
              onDownload={() => {}}
            />
          )}

        </div>

      </div>
    </div>
  </div>
);

}
