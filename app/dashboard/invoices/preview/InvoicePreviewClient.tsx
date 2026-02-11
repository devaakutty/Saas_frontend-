"use client";

import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoicesStore } from "@/hooks/useInvoicesStore";
import { calculateInvoiceTotals } from "@/utils/gstCalculator";
import { useRouter } from "next/navigation";

// full client logic here


function generateInvoiceNo() {
  const prefix = "MAI";
  const now = new Date();

  const base = `${prefix}-${now.getDate()}${now.getMonth() + 1}${String(
    now.getFullYear()
  ).slice(-2)}`;

  const count =
    (Number(localStorage.getItem(base)) || 0) + 1;

  localStorage.setItem(base, String(count));

  return `${base}-${String(count).padStart(3, "0")}`;
}

export default function InvoicePreviewClient() {
  const router = useRouter();
  const { draft, setDraft } = useInvoiceDraft();
  const { addInvoice } = useInvoicesStore();

  if (!draft || draft.items.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No invoice data found.
      </div>
    );
  }

  const { subtotal, gstAmount, total } =
    calculateInvoiceTotals(draft.items);

  const saveInvoice = () => {
    const invoiceNo = generateInvoiceNo();

    addInvoice({
      id: crypto.randomUUID(),
      invoiceNo,
      customer: {
        name: draft.customerName,
        phone: "",
      },
      products: draft.items.map((i) => ({
        name: i.name,
        qty: i.quantity,
        rate: i.price,
      })),
      billing: {
        subTotal: subtotal,
        gst: gstAmount,
        tax: 0,
        total,
      },
      payment: {
        method: "PENDING",
      },
      status: "UNPAID",
      createdAt: new Date().toISOString(),
    });

    setDraft(null);
    router.push("/invoices");
  };

  return (
    <div className="max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Invoice Preview</h1>

      <p>
        <b>Customer:</b> {draft.customerName}
      </p>

      <div className="border rounded p-4 space-y-2">
        {draft.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="border rounded p-4 space-y-1 text-sm">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>GST: ₹{gstAmount.toFixed(2)}</p>
        <p className="font-bold text-lg">
          Total: ₹{total.toFixed(2)}
        </p>
      </div>

      <button
        onClick={saveInvoice}
        className="px-5 py-2 bg-black text-white rounded"
      >
        Confirm & Save Invoice
      </button>
    </div>
  );
}
