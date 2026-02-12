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

        // 🔐 Handle auth error
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

  /* ===== GROUP BY UNIT (Memoized) ===== */
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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-sm text-gray-400 text-center">
        Loading stock alerts…
      </div>
    );
  }

  /* ================= PLAN RESTRICTION ================= */

  if (error === "Upgrade to access analytics") {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-3">
        <p className="text-gray-500 font-semibold">
          Stock analytics available in Pro Plan
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  /* ================= GENERIC ERROR ================= */

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-sm text-red-500 text-center">
        {error}
      </div>
    );
  }

  /* ================= NO LOW STOCK ================= */

  if (!items.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-2">Stock Alert</h3>
        <p className="text-sm text-green-600">
          All items are sufficiently stocked
        </p>
      </div>
    );
  }

  /* ================= LOW STOCK UI ================= */

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-red-600">
        ⚠ Stock Alert (Below 5)
      </h3>

      {/* SUMMARY */}
      <div className="text-sm text-gray-700 space-y-1">
        {Object.entries(unitCount).map(([unit, count]) => (
          <div key={unit}>
            • <b>{count}</b> product(s) in <b>{unit}</b>
          </div>
        ))}
      </div>

      {/* LIST */}
      <ul className="space-y-3 pt-2 border-t">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium">
              {item.name}
            </span>

            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
              {item.quantity} {item.unit ?? "pcs"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
