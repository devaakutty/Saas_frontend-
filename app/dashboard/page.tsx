"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import DevicesChart from "@/components/dashboard/DevicesChart";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import StockAlert from "@/components/dashboard/StockAlert";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */

type Invoice = {
  _id: string;
  status: "PAID" | "UNPAID";
  total: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);


  const colorMap = {
  totalSales: "bg-green-500/10 text-green-400",
  totalExpense: "bg-red-500/10 text-red-400",
  pendingPayment: "bg-yellow-500/10 text-yellow-400",
  paymentReceived: "bg-blue-500/10 text-blue-400",
};
const baseStyle =
  "bg-white/[0.03] border border-white/10 text-purple-400";


  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!user) return;

    const loadInvoices = async () => {
      try {
        const data = await apiFetch<Invoice[]>("/invoices");
        setInvoices(data || []);
      } catch (error: any) {
        if (error.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }
        console.error(error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [user, router]);

  /* ================= KPI CALC ================= */

  const kpis = useMemo(() => {
    let totalSales = 0;
    let pendingAmount = 0;

    invoices.forEach((inv) => {
      if (inv.status === "PAID") totalSales += inv.total;
      else pendingAmount += inv.total;
    });

    return {
      totalSales,
      pendingAmount,
      receivedAmount: totalSales,
      totalExpense: 0,
    };
  }, [invoices]);

  /* ================= LOADING ================= */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] to-[#2b2e63]">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm uppercase tracking-widest opacity-70">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD UI ================= */

  return (
    <div className="relative px-6 pt-6 pb-12">

      {/* Main Rounded Container */}
      <div className="relative backdrop-blur-2xl bg-gradient-to-br 
        from-white/10 to-white/5 
        border border-white/20 
        rounded-[32px] 
        shadow-[0_0_60px_rgba(0,0,0,0.4)] 
        p-10 
        text-white 
        space-y-12"
      >

        {/* Header */}
        <h1 className="font-[var(--font-playfair)] text-5xl font-light tracking-tight">
          Welcome Back
          <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Sales" value={kpis.totalSales} type="totalSales" />
          <StatCard title="Total Expense" value={kpis.totalExpense} type="totalExpense" />
          <StatCard title="Pending Amount" value={kpis.pendingAmount} type="pendingPayment" />
          <StatCard title="Received Amount" value={kpis.receivedAmount} type="paymentReceived" />
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] p-8 shadow-xl">
            <h3 className="text-lg font-semibold mb-6">
              Sales Analytics
            </h3>
            <SalesChart />
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] p-8 shadow-xl">
            <h3 className="text-lg font-semibold mb-6">
              Device Usage
            </h3>
            <DevicesChart />
          </div>
        </div>

        {/* RECENT + ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] p-8 shadow-xl">
            <h3 className="text-lg font-semibold mb-6">
              Recent Invoices
            </h3>
            <RecentInvoices />
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] p-8 shadow-xl">
            <h3 className="text-lg font-semibold mb-6">
              Stock Alerts
            </h3>
            <StockAlert />
          </div>
        </div>

      </div>
    </div>
  );

}
