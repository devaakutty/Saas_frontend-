"use client";

import { Suspense } from "react";
// import RegisterContent from "./RegisterContent";
// import { useSearchParams } from "next/navigation";

import RegisterContent from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
