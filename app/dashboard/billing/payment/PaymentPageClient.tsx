"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentSelector from "@/components/billing/PaymentSelector";
import { apiFetch } from "@/server/api";

export default function PaymentPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const invoiceId = searchParams.get("invoiceId");

  const [payment, setPayment] = useState<{
    method: string;
    provider?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!invoiceId) {
      setError("Invoice not found");
      return;
    }

    if (!payment) {
      setError("Please select a payment method");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          invoiceId,
          method: payment.method,
          provider: payment.provider,
        }),
      });

      router.push(`/invoices/${invoiceId}`);
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Payment</h1>

      <PaymentSelector onChange={setPayment} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={loading}
        onClick={handleConfirm}
        className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm & Generate Invoice"}
      </button>
    </div>
  );
}
