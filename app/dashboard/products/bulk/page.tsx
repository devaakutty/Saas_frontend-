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
  <div className="px-10 py-12">

    <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-purple-500/30 blur-[150px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-pink-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 space-y-12 max-w-3xl">

        {/* HEADER */}
        <button
          onClick={() => router.push("/dashboard/products")}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          ← Back
        </button>

        <div>
          <h1 className="font-[var(--font-playfair)] text-[64px] leading-[0.95] tracking-tight text-white">
            Bulk Add{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>

          <p className="font-[var(--font-inter)] mt-6 text-white/70 text-lg">
            Enter one product per line in the format:
          </p>

          <p className="font-mono text-white/50 mt-2">
            Name, Stock, Price, Unit
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 rounded-[16px] px-4 py-3">
            {error}
          </div>
        )}

        {/* TEXTAREA */}
        <textarea
          rows={14}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Apple, 50, 30, kg
Milk 1L, 40, 45, litre
Chocolate Dark, 60, 95, pcs`}
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-6 font-mono text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
        />

        {/* ACTION BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Products"}
        </button>

      </div>
    </div>
  </div>
);

}
