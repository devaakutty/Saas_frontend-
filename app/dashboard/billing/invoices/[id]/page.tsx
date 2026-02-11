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
    <div className="max-w-md mx-auto bg-white p-6 border rounded space-y-4">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-bold text-lg">Invoice</h2>
        <p className="text-sm text-gray-500">
          Invoice No: {invoice.invoiceNo}
        </p>
      </div>

      <hr />

      {/* CUSTOMER */}
      <div className="text-sm space-y-1">
        <p><b>Customer:</b> {invoice.customer.name}</p>
        {invoice.customer.phone && (
          <p><b>Phone:</b> {invoice.customer.phone}</p>
        )}
        <p>
          <b>Date:</b>{" "}
          {new Date(invoice.createdAt).toLocaleString()}
        </p>
      </div>

      <hr />

      {/* ITEMS */}
      <div>
        <h3 className="font-semibold mb-2">Items</h3>

        {invoice.items.length === 0 ? (
          <p className="text-sm text-gray-500">
            No items
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left">Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td>{item.productName}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr />

      {/* TOTAL */}
      <div className="text-sm space-y-1">
        <p className="font-bold text-lg">
          Total: ₹{invoice.total}
        </p>
      </div>

      <hr />

      {/* PAYMENT */}
      {invoice.payment && (
        <p className="text-sm">
          <b>Payment:</b> {invoice.payment.method}
          {invoice.payment.provider
            ? ` (${invoice.payment.provider})`
            : ""}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => window.print()}
          className="flex-1 py-2 bg-black text-white rounded"
        >
          Print / Download
        </button>

        <button
          onClick={() => router.push("/billing")}
          className="flex-1 py-2 border rounded"
        >
          New Bill
        </button>
      </div>
    </div>
  );
}
