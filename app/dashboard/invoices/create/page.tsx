"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import PaymentMethod from "@/components/billing/PaymentMethod";
import { useInvoicesStore } from "@/hooks/useInvoicesStore";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
}

interface Item {
  name: string;
  quantity: number;
  price: number;
}

/* ================= HELPERS ================= */

function generateInvoiceNo() {
  const prefix = "MAI";
  let userLetter = "X";

  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.email) {
          userLetter = parsed.email.charAt(0).toUpperCase();
        }
      } catch {}
    }
  }

  const now = new Date();
  const day = now.getDate();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const baseKey = `${prefix}-${userLetter}${day}${month}${year}`;
  const count = (Number(localStorage.getItem(baseKey)) || 0) + 1;
  localStorage.setItem(baseKey, String(count));

  return `${baseKey}-${String(count).padStart(3, "0")}`;
}

/* ================= PAGE ================= */

export default function CreateInvoicePage() {
  const router = useRouter();
  const { addInvoice } = useInvoicesStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: 1, price: 0 },
  ]);

  /* ===== LOAD CUSTOMERS ===== */
  useEffect(() => {
    apiFetch<Customer[]>("/customers").then(setCustomers);
  }, []);

  /* ===== TOTAL ===== */
  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  /* ===== ITEM HANDLERS ===== */
  const addItem = () =>
    setItems([...items, { name: "", quantity: 1, price: 0 }]);

    const updateItem = (
      index: number,
      field: keyof Item,
      value: string
    ) => {
      setItems((prev) => {
        const copy = [...prev];

        if (field === "name") {
          copy[index] = {
            ...copy[index],
            name: value,
          };
        } else if (field === "quantity") {
          copy[index] = {
            ...copy[index],
            quantity: Number(value),
          };
        } else if (field === "price") {
          copy[index] = {
            ...copy[index],
            price: Number(value),
          };
        }

        return copy;
      });
    };


  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  /* ================= SAVE + PAYMENT ================= */

    const handleConfirmPayment = async (
      method: "CASH" | "UPI" | "CARD",
      details: any
    ) => {
      if (!customerId) {
        alert("Select a customer");
        return;
      }

      try {
        const invoiceNo = generateInvoiceNo();

        /* 🔥 FIXED PAYLOAD */
        const cleanItems = items
          .filter(
            (i) =>
              i.name.trim() &&
              Number.isInteger(Number(i.quantity)) &&
              Number(i.quantity) > 0 &&
              Number.isFinite(Number(i.price))
          )
          .map((i) => ({
            productName: i.name.trim(),
            qty: Number(i.quantity),
            rate: Number(i.price),
          }));

        if (!cleanItems.length) {
          alert("Please add valid product quantity");
          return;
        }

        /* 1️⃣ BACKEND STORE */
        await apiFetch("/invoices", {
          method: "POST",
          body: JSON.stringify({
            invoiceNo,
            customerId,
            items: cleanItems,
          }),
        });

        /* 2️⃣ FRONTEND STORE */
      addInvoice({
        id: crypto.randomUUID(),
        invoiceNo, // ✅ ADD THIS LINE

        customer: { name: "", phone: "" },

        products: cleanItems.map((i) => ({
          name: i.productName,
          qty: i.qty,
          rate: i.rate,
        })),

        billing: {
          subTotal: total,
          tax: 0,
          gst: 0,
          total,
        },

        payment: {
          method,
          provider: details.provider,
        },

        status: "PAID",
        createdAt: new Date().toISOString(),
      });
        router.push("/invoices");
      } catch (err: any) {
        alert(err.message || "Failed to create invoice");
      }
    };


  /* ================= UI ================= */

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Create Invoice</h1>

      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="">Select Customer</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item.name}
            onChange={(e) => updateItem(i, "name", e.target.value)}
            className="border px-2 py-1 flex-1"
            placeholder="Product"
          />
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => updateItem(i, "quantity", e.target.value)}
            className="border px-2 py-1 w-20"
          />
          <input
            type="number"
            min={0}
            value={item.price}
            onChange={(e) => updateItem(i, "price", e.target.value)}
            className="border px-2 py-1 w-28"
          />
          <button onClick={() => removeItem(i)} className="text-red-600">
            Remove
          </button>
        </div>
      ))}

      <button onClick={addItem} className="text-blue-600">
        + Add Item
      </button>

      <div className="text-right font-bold text-xl">
        Total: ₹{total.toFixed(2)}
      </div>

      <PaymentMethod total={total} onConfirm={handleConfirmPayment} />
    </div>
  );
}
