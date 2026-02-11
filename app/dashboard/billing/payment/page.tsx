import { Suspense } from "react";
import PaymentPageClient from "./PaymentPageClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading payment…</div>}>
      <PaymentPageClient />
    </Suspense>
  );
}
