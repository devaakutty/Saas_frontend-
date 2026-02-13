"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

type Invoice = {
  id: string;
  invoiceNo: string;
  createdAt: string;
  total: number;
  customer: {
    name: string;
    phone?: string;
  };
  items: {
    productName: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  payment?: {
    method: string;
    provider?: string;
  };
};

/* ================= PAGE ================= */

export default function InvoiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvoice();
  }, []);

    const loadInvoice = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Invoice>(`/invoices/${params.id}`);
        setInvoice(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading invoice...
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6 text-center text-red-600">
        Invoice not found
      </div>
    );
  }
return (
  <div className="relative px-6 pt-6 pb-12 text-white">

    <div className="max-w-3xl mx-auto backdrop-blur-2xl 
      bg-gradient-to-br from-white/10 to-white/5
      border border-white/20
      rounded-[32px]
      shadow-[0_0_60px_rgba(0,0,0,0.4)]
      p-8 space-y-8"
    >

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="font-[var(--font-playfair)] text-3xl font-light tracking-tight">
          Invoice
          <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            #{invoice.invoiceNo}
          </span>
        </h1>
        <p className="text-sm text-gray-400">
          {new Date(invoice.createdAt).toLocaleString()}
        </p>
      </div>

      {/* CUSTOMER SECTION */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Customer Details
        </p>
        <p className="text-lg font-semibold">
          {invoice.customer.name}
        </p>
        {invoice.customer.phone && (
          <p className="text-sm text-gray-300">
            {invoice.customer.phone}
          </p>
        )}
      </div>

      {/* ITEMS */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-300 uppercase tracking-widest text-xs">
            <tr>
              <th className="text-left p-4">Item</th>
              <th className="text-center p-4">Qty</th>
              <th className="text-right p-4">Rate</th>
              <th className="text-right p-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr
                key={i}
                className="border-t border-white/10 hover:bg-white/5 transition-all"
              >
                <td className="p-4">{item.productName}</td>
                <td className="p-4 text-center">{item.quantity}</td>
                <td className="p-4 text-right">₹{item.rate}</td>
                <td className="p-4 text-right font-semibold">
                  ₹{item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL SECTION */}
      <div className="flex justify-between items-center text-lg font-semibold border-t border-white/10 pt-6">
        <span>Total</span>
        <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
          ₹{invoice.total}
        </span>
      </div>

      {/* PAYMENT */}
      {invoice.payment && (
        <div className="text-sm text-gray-300 border-t border-white/10 pt-4">
          <b>Payment:</b> {invoice.payment.method}
          {invoice.payment.provider
            ? ` (${invoice.payment.provider})`
            : ""}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 pt-6">

        <button
          onClick={() => window.print()}
          className="flex-1 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:scale-[1.03] transition-all duration-300 shadow-lg"
        >
          Print / Download
        </button>

        <button
          onClick={() => router.push("/billing")}
          className="flex-1 py-3 rounded-xl font-semibold 
            border border-white/20
            hover:bg-white/10 transition-all duration-300"
        >
          New Bill
        </button>

      </div>
    </div>
  </div>
);

}
