"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { motion } from "framer-motion";
import {
  User,
  ShoppingBag,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import CustomerSelector, {
  type Customer,
} from "@/components/billing/CustomerSelector";

import ProductTable, {
  type Product,
} from "@/components/billing/ProductTable";

import BillingSummary from "@/components/billing/BillingSummary";

import PaymentMethod, {
  PaymentMethodType,
  PaymentDetails,
} from "@/components/billing/PaymentMethod";

/* ================= TYPES ================= */

type BillingTotals = {
  subTotal: number;
  tax: number;
  gst: number;
  total: number;
};

/* ================= PAGE ================= */

export default function BillingPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [billing, setBilling] = useState<BillingTotals>({
    subTotal: 0,
    tax: 0,
    gst: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);

  /* ================= LOAD CUSTOMERS ================= */

  useEffect(() => {
    apiFetch<Customer[]>("/customers")
      .then((data) =>
        setCustomers(
          (data ?? []).map((c) => ({
            ...c,
            phone: c.phone ?? "",
          }))
        )
      )
      .catch(() => setCustomers([]));
  }, []);

  /* ================= RESET BILLING ================= */

  const resetBilling = () => {
    setCustomer(null);
    setProducts([]);
    setBilling({
      subTotal: 0,
      tax: 0,
      gst: 0,
      total: 0,
    });
    setLastInvoiceId(null);
  };

  /* ================= ADD / UPDATE CUSTOMER ================= */

  const handleAddCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const id = customer.id || customer._id;
      return [
        ...prev.filter((c) => (c.id || c._id) !== id),
        customer,
      ];
    });
  };

  /* ================= CREATE INVOICE (NO PAYMENT) ================= */

  const createInvoiceOnly = async () => {
    if (!customer || products.length === 0) {
      alert("Customer and products required");
      return null;
    }

    try {
      setLoading(true);

      const invoice = await apiFetch<any>("/invoices", {
        method: "POST",
        body: JSON.stringify({
          customerId: customer.id || customer._id,
          items: products.map((p) => ({
            productId: p.id || p._id,
            productName: p.name,
            quantity: p.quantity,
            rate: p.rate,
            amount: p.quantity * p.rate,
          })),
          total: billing.total,
          status: "PENDING",
        }),
      });

      return invoice.id || invoice._id;
    } catch (err: any) {
      alert(err.message || "Invoice creation failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYMENT HANDLER ================= */

  const handlePayment = async (
    method: PaymentMethodType,
    details: PaymentDetails
  ) => {
    if (!customer || products.length === 0) {
      alert("Customer and products required");
      return;
    }

    try {
      setLoading(true);

      const invoice = await apiFetch<any>("/invoices", {
        method: "POST",
        body: JSON.stringify({
          customerId: customer.id || customer._id,

          // ✅ ADD HERE (THIS IS THE PLACE)
          items: products.map((p) => ({
            productId: p.productId,   // 🔥 REQUIRED for stock update
            productName: p.name,
            quantity: p.quantity,
            rate: p.rate,
            amount: p.quantity * p.rate,
          })),

          total: billing.total,
          status: "PAID",
          payment: {
            method,
            ...details,
          },
        }),
      });

      setLastInvoiceId(invoice.id || invoice._id);

      alert("Payment successful 🎉");

      // ✅ NEW BILL
      resetBilling();
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD HANDLER ================= */

  const handleDownload = async () => {
    try {
      let invoiceId = lastInvoiceId;

      if (!invoiceId) {
        invoiceId = await createInvoiceOnly();
        if (!invoiceId) return;
      }

      const blob = await apiFetch<Blob>(
        `/invoices/${invoiceId}/pdf`,
        { method: "GET" },
        "blob"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Invoice.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      // ✅ NEW BILL
      resetBilling();
    } catch {
      alert("Invoice download failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-[#F4F4F4] min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-8 space-y-6">
          <CustomerSelector
            customers={customers}
            onSelect={setCustomer}
            onAddCustomer={handleAddCustomer}
          />

          {customer && (
            <div className="bg-gray-50 border border-dashed rounded-xl p-3 flex justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Selected Customer
                </p>
                <p className="font-semibold">{customer.name}</p>
                <p className="text-xs">{customer.phone}</p>
              </div>
              <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center">
                ✓
              </div>
            </div>
          )}

          <ProductTable
            onProductsChange={setProducts}
            onBillingChange={setBilling}
          />
        </div>

        {/* RIGHT */}
        <div className="xl:col-span-4">
          <BillingSummary billing={billing} />

          {billing.total > 0 && (
            <PaymentMethod
              total={billing.total}
              loading={loading}
              onConfirm={handlePayment}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
}
