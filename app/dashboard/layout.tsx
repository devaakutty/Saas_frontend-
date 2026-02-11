"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AuthGuard from "@/components/AuthGuard";
import { InvoiceStoreProvider } from "@/hooks/useInvoicesStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ Reset scroll when route changes
  useEffect(() => {
    const main = document.getElementById("dashboard-main");
    if (main) main.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <AuthGuard>
      <InvoiceStoreProvider>
        <div className="flex h-screen overflow-hidden bg-zinc-50">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Right Side */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />

            {/* 🔥 Key forces clean re-render on route change */}
            <main
              id="dashboard-main"
              key={pathname}
              className="flex-1 overflow-y-auto p-6 no-scrollbar"
            >
              {children}
            </main>

          </div>
        </div>
      </InvoiceStoreProvider>
    </AuthGuard>
  );
}
