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

  /* ✅ Reset scroll on route change */
  useEffect(() => {
    const main = document.getElementById("dashboard-main");
    if (main) main.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <AuthGuard>
      <InvoiceStoreProvider>
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] text-white relative">

          {/* Glow Background */}
          <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[160px] rounded-full pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10">
            <Sidebar />
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">

            <Topbar />

            {/* Main Content */}
            <main
              id="dashboard-main"
              key={pathname}
              className="flex-1 overflow-y-auto px-8 pt-28 pb-10 no-scrollbar"
            >

              {children}
            </main>

          </div>
        </div>
      </InvoiceStoreProvider>
    </AuthGuard>
  );
}
