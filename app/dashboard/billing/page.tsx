"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/server/api";

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
  const [resetKey, setResetKey] = useState(0);

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

      // 🔥 Force ProductTable remount
      setResetKey(prev => prev + 1);
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
            productId: p.productId, // ✅ FIXED
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

        await apiFetch("/invoices", {
          method: "POST",
          body: JSON.stringify({
            customerId: customer.id || customer._id,
            items: products.map((p) => ({
              productId: p.productId,
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

        alert("Payment successful 🎉");

        // 🔥 Fully reset everything cleanly
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

      resetBilling();
    } catch {
      alert("Invoice download failed");
    }
  };

  /* ================= UI ================= */

return (
//  <div className="relative px-6 pt-6 pb-12 min-h-screen"> 
    // <div className="relative px-1 pb-12 justify-top-0 mt-0">
    <div className="relative px-6 pt-4 pb-12 min-h-screen">



    {/* Main Rounded Glass Container */}
    <div className="relative backdrop-blur-2xl 
      bg-gradient-to-br from-white/10 to-white/5 
      border border-white/20 
      rounded-[32px] 
      shadow-[0_0_60px_rgba(0,0,0,0.4)] 
      p-8 
      text-white"
    >

      {/* <div className="grid grid-cols-1 xl:grid-cols-12 gap-8"> */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* LEFT SIDE */}
        <div className="xl:col-span-8 space-y-6">

          <CustomerSelector
            customers={customers}
            onSelect={setCustomer}
            onAddCustomer={handleAddCustomer}
          />

          {customer && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Selected Customer
                </p>
                <p className="font-semibold text-lg">
                  {customer.name}
                </p>
                <p className="text-sm text-gray-300">
                  {customer.phone}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg">
                ✓
              </div>
            </div>
          )}

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <ProductTable
            key={resetKey}
            onProductsChange={setProducts}
            onBillingChange={setBilling}
          />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-4 space-y-6">

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <BillingSummary billing={billing} />
          </div>

          {billing.total > 0 && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <PaymentMethod
                total={billing.total}
                loading={loading}
                onConfirm={handlePayment}
                onDownload={handleDownload}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
);

}
