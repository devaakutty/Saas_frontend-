"use client";

import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoicesStore } from "@/hooks/useInvoicesStore";
import { calculateInvoiceTotals } from "@/utils/gstCalculator";
import { useRouter } from "next/navigation";

/* ================= INVOICE NUMBER ================= */

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

/* ================= COMPONENT ================= */

export default function InvoicePreviewClient() {
  const router = useRouter();
  const { draft, setDraft } = useInvoiceDraft();
  const { addInvoice } = useInvoicesStore();

  /* 🔥 NO DATA STATE */
  if (!draft || draft.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 text-white/60">
        No invoice data found.
      </div>
    );
  }

  const { subtotal, gstAmount, total } =
    calculateInvoiceTotals(draft.items);

  /* ================= SAVE ================= */

 const saveInvoice = () => {
  if (!draft) return; // 🔥 important

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
    status: "PENDING",
    createdAt: new Date().toISOString(),
  });

  setDraft(null);
  router.push("/dashboard/invoices");
};


  /* ================= UI ================= */

return (
  <div className="px-10 py-12">

    <div className="relative rounded-[28px] overflow-hidden bg-[linear-gradient(135deg,#1b1f3a,#2b2e63)] p-16">

      {/* Glow Effects */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-purple-500/30 blur-[150px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-pink-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-3xl space-y-12">

        {/* HERO */}
        <div>
          <h1 className="font-[var(--font-playfair)] text-[64px] leading-[0.95] tracking-tight text-white">
            Invoice{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Preview
            </span>
          </h1>

          <p className="font-[var(--font-inter)] mt-6 text-white/70 text-lg">
            Review invoice details before confirming.
          </p>
        </div>

        {/* INVOICE CARD */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-8 space-y-6 text-white">

          <p className="font-[var(--font-inter)]">
            <span className="text-white/60">Customer:</span>{" "}
            <span className="font-medium">
              {draft.customerName}
            </span>
          </p>

          {/* ITEMS */}
          <div className="border border-white/10 rounded-[20px] p-6 space-y-3 text-sm">
            {draft.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
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

          {/* TOTALS */}
          <div className="border border-white/10 rounded-[20px] p-6 space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-white/60">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>

            <p className="flex justify-between">
              <span className="text-white/60">GST</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </p>

            <p className="flex justify-between text-lg font-semibold mt-3">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </p>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={saveInvoice}
            className="w-full py-4 rounded-[20px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg hover:opacity-90 transition"
          >
            Confirm & Save Invoice
          </button>

        </div>

      </div>
    </div>
  </div>
);

}
