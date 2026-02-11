"use client";

import { useState } from "react";
import { apiFetch } from "@/server/api";
import { useRouter } from "next/navigation";

interface BulkProduct {
  name: string;
  stock: number;
  rate: number;
  unit?: string;
}

export default function BulkAddProductsPage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!text.trim()) {
      setError("Please enter product details");
      return;
    }

    setLoading(true);

    try {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (!lines.length) {
        throw new Error("Please enter at least one product");
      }

      const products: BulkProduct[] = [];
      const invalidLines: number[] = [];

      lines.forEach((line, index) => {
        try {
          const parts = line.split(",").map((p) => p.trim());

          if (parts.length < 3) throw new Error();

          const unit =
            parts.length >= 4 ? parts.pop() : undefined;

          const rate = Number(parts.pop());
          const stock = Number(parts.pop());
          const name = parts.join(",");

          if (!name || isNaN(stock) || isNaN(rate)) {
            throw new Error();
          }

          products.push({
            name,
            stock,
            rate,
            unit,
          });
        } catch {
          invalidLines.push(index + 1);
        }
      });

      if (!products.length) {
        throw new Error("No valid products found");
      }

      await apiFetch("/products/bulk", {
        method: "POST",
        body: JSON.stringify({ products }),
      });

      if (invalidLines.length) {
        alert(
          `Products added successfully.\nSkipped invalid lines: ${invalidLines.join(
            ", "
          )}`
        );
      }

      // ✅ FIXED ROUTE
      router.push("/dashboard/products");

    } catch (err: any) {
      setError(err.message || "Bulk add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            router.push("/dashboard/products")
          }
          className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">
          Bulk Add Products
        </h1>
      </div>

      <p className="text-sm text-gray-500">
        Enter one product per line:
        <br />
        <span className="font-mono">
          Name, Stock, Price, Unit
        </span>
      </p>

      {error && (
        <div className="text-red-600 bg-red-50 border p-2 rounded">
          {error}
        </div>
      )}

      <textarea
        rows={14}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Apple, 50, 30, kg
Milk 1L, 40, 45, litre
Chocolate Dark, 60, 95, pcs`}
        className="w-full border rounded p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-black text-white rounded disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add Products"}
      </button>
    </div>
  );
}
