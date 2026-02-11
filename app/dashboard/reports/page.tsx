"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type React from "react";

import {
  TrendingUp,
  BarChart3,
  Receipt,
  Package,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 bg-[#F4F4F4] min-h-screen space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            Analytics
          </span>

          <h1 className="text-3xl font-black text-black tracking-tighter mt-1">
            Reports<span className="text-gray-400">.</span>
          </h1>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Business Insights
          </p>
          <p className="text-sm font-black text-black">
            Management Hub
          </p>
        </div>
      </div>

      {/* ================= REPORT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <ReportCard
          title="Sales Report"
          desc="Track revenue & volume"
          href="/dashboard/reports/sales"
          icon={<TrendingUp size={20} />}
        />

        <ReportCard
          title="Profit & Loss"
          desc="Income vs Expenses"
          href="/dashboard/reports/profit-loss"
          icon={<BarChart3 size={20} />}
        />

        <ReportCard
          title="GST Report"
          desc="Tax & summary details"
          href="/dashboard/reports/gst"
          icon={<Receipt size={20} />}
        />

        <ReportCard
          title="Products"
          desc="Inventory management"
          href="/dashboard/products"
          icon={<Package size={20} />}
        />
      </div>
    </div>
  );
}

/* ================= REPORT CARD ================= */

function ReportCard({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, x: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="group block bg-white border-2 border-black rounded-[24px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="h-10 w-10 bg-black text-white rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-lg tracking-tight text-black">
            {title}
          </h3>
          <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
            {desc}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[10px] font-black text-black uppercase tracking-widest group-hover:underline">
            View Report
          </span>

          <ArrowRight
            size={14}
            className="text-black transition-transform group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}
