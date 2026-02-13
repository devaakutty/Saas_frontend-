"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

export interface Product {
  productId?: string; // ✅ IMPORTANT (Mongo ObjectId)
  name: string;
  quantity: number;
  rate: number;
}

interface DBProduct {
  _id: string; // ✅ Mongo _id
  name: string;
  rate: number;
  stock: number;
}

/* ================= PROPS ================= */

interface ProductTableProps {
  onProductsChange: (products: Product[]) => void;
  onBillingChange: (billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  }) => void;
}

/* ================= COMPONENT ================= */

export default function ProductTable({
  onProductsChange,
  onBillingChange,
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: 1, rate: 0 },
  ]);

  const [allProducts, setAllProducts] = useState<DBProduct[]>([]);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const lastValueRef = useRef<string[]>([""]);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    apiFetch<DBProduct[]>("/products")
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  /* ================= BILLING ================= */

  useEffect(() => {
    const subTotal = products.reduce(
      (sum, p) => sum + p.quantity * p.rate,
      0
    );

    const tax = Math.round(subTotal * 0.05);
    const gst = Math.round(subTotal * 0.18);
    const total = subTotal + tax + gst;

    onProductsChange(products);
    onBillingChange({ subTotal, tax, gst, total });
  }, [products, onProductsChange, onBillingChange]);

  /* ================= TYPEAHEAD ================= */

  const handleTypeahead = (index: number, value: string) => {
    const lastValue = lastValueRef.current[index] ?? "";

    // allow backspace
    if (value.length < lastValue.length) {
      updateProduct(index, "name", value);
      lastValueRef.current[index] = value;
      return;
    }

    if (!value) {
      updateRow(index, {
        name: "",
        productId: undefined,
        rate: 0,
      });
      lastValueRef.current[index] = "";
      return;
    }

    const match = allProducts.find((p) =>
      p.name.toLowerCase().startsWith(value.toLowerCase())
    );

    // ❌ Manual item (not in DB)
    if (!match) {
      updateRow(index, {
        name: value,
        productId: undefined,
      });
      lastValueRef.current[index] = value;
      return;
    }

    // ✅ Matched DB product
    updateRow(index, {
      productId: match._id, // 🔥 THIS IS THE KEY FIX
      name: match.name,
      rate: match.rate,
    });

    lastValueRef.current[index] = match.name;

    requestAnimationFrame(() => {
      const input = inputRefs.current[index];
      if (input) {
        input.setSelectionRange(value.length, match.name.length);
      }
    });
  };

  /* ================= UPDATE HELPERS ================= */

  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string | number
  ) => {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "quantity" || field === "rate"
          ? Number(value) || 0
          : value,
    };
    setProducts(updated);
  };

  const updateRow = (index: number, data: Partial<Product>) => {
    const updated = [...products];
    updated[index] = { ...updated[index], ...data };
    setProducts(updated);
  };

  /* ================= ROW HANDLERS ================= */

  const addRow = () => {
    lastValueRef.current.push("");
    setProducts([...products, { name: "", quantity: 1, rate: 0 }]);
  };

  const removeRow = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
    lastValueRef.current.splice(index, 1);
  };

  /* ================= UI ================= */
return (
  <div className="
    backdrop-blur-2xl
    bg-gradient-to-br from-white/10 to-white/5
    border border-white/20
    rounded-[28px]
    p-6
    shadow-xl
    space-y-5
    text-white
  ">

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b border-white/10 text-gray-300 uppercase text-xs tracking-wider">
            <th className="pb-3 text-left">#</th>
            <th className="pb-3 text-left">Product</th>
            <th className="pb-3 text-left">Qty</th>
            <th className="pb-3 text-left">Rate</th>
            <th className="pb-3 text-left">Amount</th>
            <th className="pb-3"></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr
              key={i}
              className="border-b border-white/10 hover:bg-white/5 transition-all"
            >
              <td className="py-4">{i + 1}</td>

              {/* PRODUCT INPUT */}
              <td className="py-4">
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[i] = el;
                  }}
                  value={p.name}
                  onChange={(e) =>
                    handleTypeahead(i, e.target.value)
                  }
                  className="
                    w-full
                    px-4 py-2.5
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2 focus:ring-purple-400
                    transition
                  "
                  placeholder="Product name"
                />
              </td>

              {/* QUANTITY */}
              <td className="py-4">
                <input
                  type="number"
                  min={1}
                  value={p.quantity}
                  onChange={(e) =>
                    updateProduct(
                      i,
                      "quantity",
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  className="
                    w-20
                    px-3 py-2
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    focus:outline-none
                    focus:ring-2 focus:ring-purple-400
                  "
                />
              </td>

              {/* RATE */}
              <td className="py-4">
                <input
                  type="number"
                  value={p.rate}
                  onChange={(e) =>
                    updateProduct(i, "rate", e.target.value)
                  }
                  className="
                    w-24
                    px-3 py-2
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    focus:outline-none
                    focus:ring-2 focus:ring-purple-400
                  "
                />
              </td>

              {/* AMOUNT */}
              <td className="py-4 font-semibold text-purple-300">
                ₹{p.quantity * p.rate}
              </td>

              {/* REMOVE */}
              <td className="py-4">
                <button
                  onClick={() => removeRow(i)}
                  disabled={products.length === 1}
                  className="
                    text-red-400
                    hover:text-red-300
                    transition
                    disabled:opacity-30
                  "
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

    {/* ADD BUTTON */}
    <button
      onClick={addRow}
      className="
        px-5 py-2.5
        rounded-xl
        bg-gradient-to-r from-purple-500 to-pink-500
        font-semibold
        hover:scale-[1.03]
        transition-all duration-300
        shadow-lg
      "
    >
      + Add Product
    </button>
  </div>
);

}
