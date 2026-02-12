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

/* ================= COMPONENT ================= */

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  /* ================= LOAD INVOICES ================= */

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadInvoices = async () => {
      try {
        const data = await apiFetch<Invoice[]>("/invoices");

        if (!isMounted) return;

        setInvoices(data || []);
      } catch (error: any) {
        if (!isMounted) return;

        if (error.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }

        console.error("Failed to load invoices", error);
        setInvoices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, [user, router]);

  /* ================= KPI CALCULATION ================= */

  const kpis = useMemo(() => {
    let totalSales = 0;
    let pendingAmount = 0;

    invoices.forEach((inv) => {
      if (inv.status === "PAID") {
        totalSales += inv.total;
      } else {
        pendingAmount += inv.total;
      }
    });

    return {
      totalSales,
      pendingAmount,
      receivedAmount: totalSales,
      totalExpense: 0,
    };
  }, [invoices]);

  /* ================= LOADING STATES ================= */

  if (authLoading || loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-screen bg-[#F8F8F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Initialising QuickBillz...
          </p>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD UI ================= */

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen space-y-8">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={kpis.totalSales}
          type="totalSales"
        />
        <StatCard
          title="Total Expense"
          value={kpis.totalExpense}
          type="totalExpense"
        />
        <StatCard
          title="Pending Amount"
          value={kpis.pendingAmount}
          type="pendingPayment"
        />
        <StatCard
          title="Received Amount"
          value={kpis.receivedAmount}
          type="paymentReceived"
        />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 h-[400px]">
          <h3 className="text-lg font-black mb-6">
            Sales Analytics
          </h3>
          <SalesChart />
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 h-[400px]">
          <h3 className="text-lg font-black mb-6">
            Device Usage
          </h3>
          <DevicesChart />
        </div>
      </div>

      {/* RECENT + ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
          <h3 className="text-lg font-black mb-6">
            Recent Invoices
          </h3>
          <RecentInvoices />
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
          <h3 className="text-lg font-black mb-6">
            Stock Alerts
          </h3>
          <StockAlert />
        </div>
      </div>
    </div>
  );
}
