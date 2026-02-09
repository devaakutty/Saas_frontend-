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
    <div className="bg-white border rounded p-4 space-y-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-b">
              <td>{i + 1}</td>

              <td>
              <input
                ref={(el) => {
                  if (el) inputRefs.current[i] = el;
                }}
                className="border px-2 py-1 w-full"
                value={p.name}
                onChange={(e) =>
                  handleTypeahead(i, e.target.value)
                }
              />
              </td>

              <td>
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
                />
              </td>

              <td>
                <input
                  type="number"
                  className="border px-2 py-1 w-20"
                  value={p.rate}
                  onChange={(e) =>
                    updateProduct(i, "rate", e.target.value)
                  }
                />
              </td>

              <td>₹{p.quantity * p.rate}</td>

              <td>
                <button
                  onClick={() => removeRow(i)}
                  disabled={products.length === 1}
                  className="text-red-600 hover:underline disabled:opacity-40"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add product
      </button>
    </div>
  );
}
