import { Suspense } from "react";
import PaymentPageClient from "./PaymentPageClient";

function PaymentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] relative overflow-hidden text-white">

      {/* Glow Effects */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[160px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center gap-6 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[32px] px-12 py-10 shadow-2xl">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm uppercase tracking-widest text-gray-300">
          Preparing Secure Payment...
        </p>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentPageClient />
    </Suspense>
  );
}
