"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

interface StockItem {
  _id: string;
  name: string;
  quantity: number;
  unit?: string;
}

export default function StockAlert() {
  const router = useRouter();

  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadLowStock = async () => {
      try {
const res = await apiFetch<StockItem[]>(
  "/dashboard/low-stock"
);



        if (!isMounted) return;

        setItems(res ?? []);
      } catch (err: any) {
        if (!isMounted) return;

        if (err.message === "Not authorized, please login") {
          router.replace("/login");
          return;
        }

        setError(err.message || "Failed to load stock alerts");
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLowStock();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ===== GROUP BY UNIT ===== */
  const unitCount = useMemo(() => {
    const map: Record<string, number> = {};

    items.forEach((item) => {
      const unit = item.unit ?? "pcs";
      map[unit] = (map[unit] || 0) + 1;
    });

    return map;
  }, [items]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-sm text-center text-white/60">
        Loading stock alerts…
      </div>
    );
  }

  /* ================= PLAN RESTRICTION ================= */

if (error === "Upgrade to access analytics") {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center space-y-4 shadow-lg">

      <div className="text-4xl"></div>

      <p className="text-white/80 font-semibold text-lg">
        Stock Analytics Available in Pro Plan
      </p>

      {/* <p className="text-white/50 text-sm">
        Upgrade your plan to unlock low stock insights and advanced inventory tracking.
      </p> */}

      <button
        onClick={() => router.push("/dashboard/settings/company")}
         className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-xl transition shadow-lg"
        // className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-6 py-2 rounded-xl transition shadow-lg"
      >
        Upgrade Now
      </button>
    </div>
  );
}


  /* ================= GENERIC ERROR ================= */

  if (error) {
    return (
      <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-sm text-red-400 text-center">
        {error}
      </div>
    );
  }

  /* ================= NO LOW STOCK ================= */

  if (!items.length) {
    return (
      <div className="border-b border-white/10 last:border-none hover:bg-white/5 transition rounded-2xl p-6 text-center">
        <h3 className="font-semibold mb-2 text-white/70">
          Stock Status
        </h3>
        <p className="text-sm text-white/80">
          All items are sufficiently stocked
        </p>
      </div>
    );
  }

  /* ================= LOW STOCK UI ================= */

  return (
    <div className="bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-5 shadow-lg">

      <h3 className="font-semibold text-white/80 text-sm flex items-center gap-2">
        ⚠ Low Stock Alert (Below 5)
      </h3>

      {/* SUMMARY */}
      <div className="text-sm text-white/70 space-y-1">
        {Object.entries(unitCount).map(([unit, count]) => (
          <div key={unit}>
            • <b>{count}</b> product(s) in <b>{unit}</b>
          </div>
        ))}
      </div>

      {/* LIST */}
      <ul className="space-y-3 pt-3 border-t border-white/10">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium text-white">
              {item.name}
            </span>

            <span className="bg-primary/45 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {item.quantity} {item.unit ?? "pcs"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
