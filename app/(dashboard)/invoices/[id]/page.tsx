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
  quantity: number;
  rate: number;
  amount: number;
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
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  /* ================= LOAD INVOICE ================= */

  useEffect(() => {
    if (!invoiceId) return;

    apiFetch<Invoice>(`/invoices/${invoiceId}`)
      .then(setInvoice)
      .finally(() => setLoading(false));
  }, [invoiceId]);

  if (loading) return <div className="p-6">Loading invoice…</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  /* ================= CALCULATIONS ================= */

  const GST_RATE = 0.18;
  const subTotal = invoice.total;
  const gstAmount = subTotal * GST_RATE;
  const grandTotal = subTotal + gstAmount;

  /* ================= PAYMENT HANDLER ================= */

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

      alert("Payment successful ✅");

      setInvoice({ ...invoice, status: "PAID" });
      router.push("/billing");
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
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Invoice download failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-gray-50">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-600 hover:text-black"
      >
        ← Back
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Invoice {invoice.invoiceNo}
        </h1>

        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            invoice.status === "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white border rounded p-4 space-y-1">
        <p>
          <b>Customer:</b>{" "}
          {invoice.customer?.name || "—"}
        </p>
        <p>
          <b>Date:</b>{" "}
          {new Date(invoice.createdAt).toDateString()}
        </p>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded p-4 space-y-2">
        {invoice.items.map((item, i) => (
          <div
            key={`${item.productName}-${i}`}
            className="flex justify-between"
          >
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>₹{item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="bg-white border rounded p-4 space-y-2">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="bg-white border rounded p-4 space-y-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Download Invoice (PDF)
        </button>

        {invoice.status === "PENDING" && (
          <PaymentMethod
            total={grandTotal}
            loading={paying}
            onConfirm={handlePayment}
          />
        )}
      </div>
    </div>
  );
}
