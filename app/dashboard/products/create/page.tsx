"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

export default function CreateProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  // const [unit, setUnit] = useState<"pcs" | "kg" | "liter" | "">("");
  // const [unit, setUnit] = useState<"pcs" | "kg" | "liter" | "">("");
  const [unit, setUnit] = useState("");


  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !rate) {
      alert("Product name and rate are required");
      return;
    }

    if (!unit) {
      alert("Please select a unit");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          rate: Number(rate),
          unit,
          stock: Number(stock) || 0,
        }),
      });

      router.push("/dashboard/products");
    } catch (err: any) {
      alert(err.message || "Failed to create product");
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

      <div className="relative z-10 space-y-12 max-w-2xl">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
        >
          ← Back
        </button>

        {/* Heading */}
        <div>
          <h1 className="font-[var(--font-playfair)] text-[64px] leading-[0.95] tracking-tight text-white">
            Create{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Product
            </span>
          </h1>

          <p className="font-[var(--font-inter)] mt-6 text-white/70 text-lg">
            Add a new product to your inventory.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
          />

          <input
            type="number"
            min={0}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Rate"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
          />

          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit (e.g. pcs, kg, liter)"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
          />

          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Opening Stock"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
          />

        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          <button
            onClick={() => router.back()}
            className="px-8 py-3 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  </div>
);

}
