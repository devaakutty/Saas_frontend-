"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
// import Footer from "@/components/layout/Footer";
import AuthGuard from "@/components/AuthGuard";
import { InvoiceStoreProvider } from "@/hooks/useInvoicesStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <InvoiceStoreProvider>
        {/* 🔒 Lock layout to viewport */}
        <div className="flex h-screen overflow-hidden bg-zinc-50">
          
          {/* Sidebar (fixed, no scroll) */}
          <Sidebar />

          {/* Right side */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />

            {/* ✅ ONLY this area scrolls */}
            <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {children}
            </main>

            {/* Footer stays visible */}
            {/* <Footer /> */}
          </div>

        </div>
      </InvoiceStoreProvider>
    </AuthGuard>
  );
}
