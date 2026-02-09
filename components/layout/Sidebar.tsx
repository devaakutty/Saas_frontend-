"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "./sidebarConfig";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    // 🔐 remove auth token
    localStorage.removeItem("token");

    // 🔁 redirect to login
    router.replace("/login");
  };

  return (
    <div className="hidden md:flex h-screen p-6 bg-[#F8F8F8] sticky top-0">
      <aside className="w-20 lg:w-64 h-full bg-black text-white rounded-[32px] flex flex-col py-8 shadow-2xl overflow-hidden">
        
        {/* LOGO */}
        <div className="mb-10 flex flex-col items-center lg:items-start lg:px-8 w-full shrink-0">
          <div className="bg-white text-black w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl">
            Joe.
          </div>
          <h1 className="hidden lg:block text-xl font-bold tracking-tight">
            QuickBillz
          </h1>
          <p className="hidden lg:block text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">
            Premium POS
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 w-full px-4 space-y-2 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`group relative flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <div
                  className={`${
                    active
                      ? "text-black"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  <LayoutDashboard size={22} strokeWidth={2.5} />
                </div>

                <span className="hidden lg:block text-sm font-bold tracking-wide">
                  {link.label}
                </span>

                {active && (
                  <div className="absolute right-3 hidden lg:block w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="w-full px-4 mt-auto pt-3 shrink-0 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start gap-4 w-full px-4 py-4 bg-white/5 rounded-2xl text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 mt-2"
          >
            <LogOut size={22} />
            <span className="hidden lg:block text-sm font-bold">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}
