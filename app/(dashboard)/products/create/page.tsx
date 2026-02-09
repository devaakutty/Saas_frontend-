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

      router.push("/products");
    } catch (err: any) {
      alert(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
       <button
      onClick={() => router.back()}
      className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
    >
      ← Back
    </button>
      <h1 className="text-2xl font-bold">Create Product</h1>

      {/* PRODUCT NAME */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        className="border px-3 py-2 rounded w-full"
      />

      {/* RATE */}
      <input
        type="number"
        min={0}
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        placeholder="Rate"
        className="border px-3 py-2 rounded w-full"
      />

      {/* UNIT SELECT */}
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit (eg: pcs, kg, liter)"
          className="border px-3 py-2 rounded w-full"
        />


      {/* OPENING STOCK */}
      <input
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Opening Stock"
        className="border px-3 py-2 rounded w-full"
      />

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
