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
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const companyName = user?.company || "QuickBillz";

    const companyInitials = companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);


  const handleLogout = async () => {
    const ok = confirm("Are you sure you want to logout?");
    if (!ok) return;

    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex items-center justify-between p-4 backdrop-blur-xl bg-white/10 border-b border-white/20 text-white">
        <div className="font-bold text-lg">QuickBillz</div>
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-screen w-64 
        backdrop-blur-2xl bg-white/10 border-r border-white/20 text-white
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <aside className="h-full flex flex-col py-8 px-5">

          {/* CLOSE BUTTON (MOBILE) */}
          <div className="md:hidden flex justify-end mb-6">
            <button onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* LOGO */}
          {/* <div className="mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-black text-xl shadow-lg">
              QB
            </div>
            <h1 className="text-xl font-bold mt-4 tracking-wide">
              QuickBillz
            </h1>
          </div> */}
          {/* LOGO */}
<div className="mb-12">
  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-black text-xl shadow-lg">
    {companyInitials}
  </div>

  <h1 className="text-xl font-bold mt-4 tracking-wide">
    {companyName}
  </h1>
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
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={20}
                      className={`transition ${
                        active
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    />
                  )}
                  <span
                    className={`font-semibold ${
                      active
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="mt-auto pt-6 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300"
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
