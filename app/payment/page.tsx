"use client";

import { Suspense } from "react";
// import PaymentContent from "./PaymentContent";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
