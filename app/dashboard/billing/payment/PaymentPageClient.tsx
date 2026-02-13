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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] text-white">

      {/* Glow Effects */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[160px] rounded-full" />

      <div className="relative z-10 w-full max-w-xl backdrop-blur-2xl 
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/20
        rounded-[32px]
        shadow-[0_0_60px_rgba(0,0,0,0.4)]
        p-10 space-y-8"
      >

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="font-[var(--font-playfair)] text-4xl font-light tracking-tight">
            Complete
            <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Payment
            </span>
          </h1>
          <p className="text-sm text-gray-400">
            Select your preferred payment method
          </p>
        </div>

        {/* Payment Selector */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <PaymentSelector onChange={setPayment} />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          disabled={loading}
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-green-400 to-emerald-500
            hover:scale-[1.03] hover:opacity-90
            transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm & Generate Invoice"}
        </button>

      </div>
    </div>
  );
}
