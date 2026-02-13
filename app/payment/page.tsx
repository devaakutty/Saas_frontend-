import { Suspense } from "react";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] text-white flex items-center justify-center px-6">

      <Suspense
        fallback={
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">
              Loading payment details...
            </p>
          </div>
        }
      >
        <PaymentContent />
      </Suspense>

    </div>
  );
}
