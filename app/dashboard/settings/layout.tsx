"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const tabs = [
  { label: "Profile", href: "/dashboard/settings/profile" },
  { label: "Company", href: "/dashboard/settings/company" },
  { label: "Notifications", href: "/dashboard/settings/notifications" },
  { label: "Security", href: "/dashboard/settings/security" },
  { label: "Appearance", href: "/dashboard/settings/appearance" },
  { label: "Integrations", href: "/dashboard/settings/integrations" },
  { label: "API", href: "/dashboard/settings/api" },
  { label: "Audit", href: "/dashboard/settings/audit" },
];

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="p-6 bg-[#F4F4F4] min-h-screen space-y-6">
      
      {/* ================= HEADER ================= */}
      <header className="bg-black rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            Configuration
          </span>

          <h1 className="text-3xl font-black tracking-tighter mt-1">
            Settings<span className="text-gray-500">.</span>
          </h1>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">
            Manage your account and platform preferences
          </p>
        </div>

        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      </header>

      {/* ================= TAB NAVIGATION ================= */}
      <nav className="flex flex-wrap gap-2 p-2 bg-white border-2 border-black rounded-[20px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all duration-200 ${
                active
                  ? "bg-black text-white"
                  : "text-gray-400 hover:text-black hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* ================= CONTENT AREA ================= */}
      <main className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[400px]">
        {children}
      </main>
    </div>
  );
}
