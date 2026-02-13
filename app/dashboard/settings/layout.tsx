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
    <div className="px-10 py-12 relative z-0">

      {/* 🔥 IMPORTANT: Removed overflow-hidden */}
      <div className="relative rounded-[28px] bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

        {/* Accent Glow */}
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-primary/30 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-primary/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-12 text-white">

          {/* HERO */}
          <div className="max-w-3xl">
            <h1 className="font-playfair text-[34px] leading-[0.95] tracking-tight">
              Account{" "}
              <span className="font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
          </div>

          {/* NAVIGATION */}
          <div className="overflow-x-auto">
            <nav className="flex gap-3 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] min-w-max">
              {tabs.map((tab) => {
                const active = isActive(tab.href);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-6 py-3 rounded-[18px] text-sm font-inter whitespace-nowrap transition-all duration-300 ${
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CONTENT */}
          <main className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-10 min-h-[400px]">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
