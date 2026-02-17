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
  Lock,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function ReportsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const isStarter = user.plan === "starter";

  return (
      <div className="relative px-1 pb-12 justify-top-0 mt-0">
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1b1f3a] via-[#24285f] to-[#2b2e63] p-16">

        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-purple-600/30 blur-[140px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-pink-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10">

          {/* HERO */}
          <div className="max-w-4xl">
            <h1 className="font-[var(--font-playfair)] text-[64px] md:text-[80px] leading-[0.95] tracking-tight text-white">
              Improve your{" "}
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reports
              </span>
            </h1>
          </div>

          {/* CARDS */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            <ReportCard
              title="Sales Report"
              desc="Track revenue & volume"
              href="/dashboard/reports/sales"
              icon={<TrendingUp size={20} />}
              locked={isStarter}
            />

            <ReportCard
              title="Profit & Loss"
              desc="Income vs Expenses"
              href="/dashboard/reports/profit-loss"
              icon={<BarChart3 size={20} />}
              locked={isStarter}
            />

            <ReportCard
              title="GST Report"
              desc="Tax & summary details"
              href="/dashboard/reports/gst"
              icon={<Receipt size={20} />}
              locked={isStarter}
            />

            {/* Products always allowed */}
            <ReportCard
              title="Products"
              desc="Inventory management"
              href="/dashboard/products"
              icon={<Package size={20} />}
              locked={false}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REPORT CARD ================= */
/* ================= REPORT CARD ================= */

function ReportCard({
  title,
  desc,
  href,
  icon,
  locked,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  locked?: boolean;
}) {
  const router = useRouter();

  const baseClasses =
    "group block p-6 rounded-[24px] backdrop-blur-xl border border-white/20 flex flex-col h-full transition-all duration-300";

  const lockedClasses =
    "bg-white/5 opacity-60 cursor-not-allowed";

  const activeClasses =
    "bg-white/10 hover:bg-white/20";

  /* ================= LOCKED VERSION ================= */
  if (locked) {
    return (
      <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
        <button
          onClick={() =>
            router.push("/dashboard/settings/company")
          }
          className={`${baseClasses} ${lockedClasses}`}
        >
          <CardContent
            title={title}
            desc={desc}
            icon={icon}
            locked
          />
        </button>
      </motion.div>
    );
  }

  /* ================= UNLOCKED VERSION ================= */
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
      <Link
        href={href}
        className={`${baseClasses} ${activeClasses}`}
      >
        <CardContent
          title={title}
          desc={desc}
          icon={icon}
        />
      </Link>
    </motion.div>
  );
}

/* ================= CARD CONTENT ================= */

function CardContent({
  title,
  desc,
  icon,
  locked,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <>
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 relative">
        {icon}
        {locked && (
          <Lock
            size={14}
            className="absolute -top-2 -right-2 text-yellow-300"
          />
        )}
      </div>

      <h3 className="font-[var(--font-playfair)] text-xl font-semibold tracking-tight text-white">
        {title}
      </h3>

      <p className="font-[var(--font-inter)] text-sm text-white/60 mt-2">
        {desc}
      </p>

      <div className="mt-8 flex items-center justify-between text-sm text-white/70">
        <span>
          {locked ? "Upgrade Required" : "View Report"}
        </span>
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </>
  );
}
