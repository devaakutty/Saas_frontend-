"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "./sidebarConfig";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black text-white">
        <div className="font-bold text-lg">QuickBillz</div>
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-screen w-64 bg-gradient-to-b from-zinc-900 to-black text-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <aside className="h-full flex flex-col py-8 px-4">

          {/* CLOSE BUTTON (MOBILE) */}
          <div className="md:hidden flex justify-end mb-6">
            <button onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* LOGO */}
          <div className="mb-10 px-4">
            <div className="bg-white text-black w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl">
              QB
            </div>
            <h1 className="text-xl font-bold mt-3">QuickBillz</h1>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 space-y-2">
            {sidebarLinks.map((link) => {
              const active =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              const Icon = link.icon;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  <span className="font-semibold">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500 hover:text-white transition"
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
