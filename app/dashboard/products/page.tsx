"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

interface Product {
  _id: string;
  name: string;
  rate: number;
  unit?: string | null;
  stock: number;
  createdAt: string; 
}

/* ================= PAGE ================= */

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* LOAD PRODUCTS */
  useEffect(() => {
    apiFetch<Product[]>("/products") // ✅ Correct backend route
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      setDeletingId(id);
      await apiFetch(`/products/${id}`, { method: "DELETE" });

      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading products…
      </div>
    );
  }

return (
  // <div className="px-10 py-12">
      <div className="relative px-1 pb-12 justify-top-0 mt-0">

    <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-purple-500/30 blur-[150px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-pink-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 space-y-16">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div>
            <button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              ← Back
            </button>

            <h1 className="font-[var(--font-playfair)] text-[64px] leading-[0.95] tracking-tight text-white">
              Manage{" "}
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Products
              </span>
            </h1>

            <p className="font-[var(--font-inter)] mt-6 text-white/70 text-lg">
              {products.length} total products in inventory
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard/products/bulk"
              className="px-6 py-3 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition"
            >
              Bulk Add
            </Link>

            <Link
              href="/dashboard/products/create"
              className="px-6 py-3 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/5 backdrop-blur-md rounded-[20px] border border-white/10 overflow-hidden">

          <table className="w-full text-sm text-white">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="p-5 text-left">Name</th>
                <th className="p-5 text-left">Rate</th>
                <th className="p-5 text-left">Stock</th>
                <th className="p-5 text-left">Unit</th>
                {/* <th className="p-5 text-left">Status</th> */}
                <th className="p-5 text-left">Created</th>

                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  onClick={() =>
                    router.push(`/dashboard/products/${p._id}`)
                  }
                  className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
                >
                  <td className="p-5 font-medium">{p.name}</td>

                  <td className="p-5">
                    ₹{p.rate.toLocaleString("en-IN")}
                  </td>

                  <td
                    className={`p-5 font-semibold ${
                      p.stock <= 5
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {p.stock}
                  </td>

                  <td className="p-5">
                    {p.unit ?? "—"}
                  </td>
                  <td className="p-5 text-white/70">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p._id);
                      }}
                      disabled={deletingId === p._id}
                      className="text-red-400 hover:underline disabled:opacity-50"
                    >
                      {deletingId === p._id
                        ? "Deleting…"
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-white/40"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  </div>
);

}
