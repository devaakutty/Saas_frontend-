"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, User, Settings, LogOut, PlusCircle } from "lucide-react";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.email
    ? user.email.split("@")[0]
    : "Deva";

  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const avatarLetter = firstName.charAt(0).toUpperCase();


  return (
    /* Changed justify-between to justify-end to push everything to the right */
    <header className="h-24 w-full flex items-center justify-end px-10 bg-[#F8F8F8] relative z-50">
      
      {/* RIGHT SIDE GROUP */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon */}
        <Link 
          href="/settings/notifications"
          className="relative p-2 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-white"
        >
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F8F8F8]" />
        </Link>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-white transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-black text-white font-bold flex items-center justify-center text-sm">
              {avatarLetter}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-black leading-none">{firstName}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Admin</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                className="absolute right-0 mt-4 w-56 bg-white rounded-[24px] shadow-2xl border border-gray-50 overflow-hidden py-2"
              >
                <div className="px-5 py-3 border-b border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</p>
                   <p className="text-sm font-bold text-black truncate">{user?.email || "deva@quickbillz.com"}</p>
                </div>

                <div className="p-2">
                  <DropdownLink href="/settings/profile" icon={<User size={16}/>}>Profile</DropdownLink>
                  <DropdownLink href="/invoices/create" icon={<PlusCircle size={16}/>}>Create Invoice</DropdownLink>
                  <DropdownLink href="/settings" icon={<Settings size={16}/>}>Settings</DropdownLink>
                  
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2"
                  >
                    {/* <LogOut size={16} />
                    Logout */}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function DropdownLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
    >
      <span className="text-gray-400">{icon}</span>
      {children}
    </Link>
  );
}