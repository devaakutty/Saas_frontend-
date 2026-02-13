// 🔥 Force dynamic rendering (no caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import InvoicePreviewClient from "./InvoicePreviewClient";

export default function InvoicePreviewPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-white/60 text-sm animate-pulse">
            Loading invoice preview...
          </div>
        }
      >
        <InvoicePreviewClient />
      </Suspense>
    </div>
  );
}
