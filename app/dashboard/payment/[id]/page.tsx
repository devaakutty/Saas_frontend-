"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import PaymentMethod, {
  PaymentMethodType,
  PaymentDetails,
} from "@/components/billing/PaymentMethod";

interface Invoice {
  _id: string;
  invoiceNo: string;
  total: number;
  status: "PAID" | "PENDING";
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD INVOICE ================= */

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      const data = await apiFetch<Invoice>(`/invoices/${invoiceId}`);
      setInvoice(data);
    } catch (err) {
      alert("Failed to load invoice");
    }
  };

  /* ================= HANDLE PAYMENT ================= */

  const handlePayment = async (
    method: PaymentMethodType,
    details: PaymentDetails
  ) => {
    try {
      setLoading(true);

      // Call backend to mark as paid
      await apiFetch(`/invoices/${invoiceId}/pay`);

      alert("Payment Successful 🎉");

      // Redirect back to billing page
      router.push("/dashboard/billing");

    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */

  const handleDownload = async () => {
    try {
      const blob = await apiFetch<Blob>(
        `/invoices/${invoiceId}/pdf`,
        { method: "GET" },
        "blob"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${invoice?.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  /* ================= UI ================= */

  if (!invoice) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center text-white/60">
        Loading payment details...
      </div>
    );
  }

  if (invoice.status === "PAID") {
    return (
      <div className="p-10 text-white">
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-green-300">
          This invoice is already paid.
        </div>

        <button
          onClick={() => router.push("/dashboard/billing")}
          className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
        >
          Back to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center text-white">
        <div>
          <h1 className="text-2xl font-semibold">
            Pay Invoice
          </h1>
          <p className="text-white/50 text-sm">
            Invoice: {invoice.invoiceNo}
          </p>
        </div>

        <div className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ₹{invoice.total.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Payment Component */}
      <PaymentMethod
        total={invoice.total}
        loading={loading}
        onConfirm={handlePayment}
        onDownload={handleDownload}
      />

    </div>
  );
}