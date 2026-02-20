  "use client";

  import { useEffect, useState } from "react";
  import { useRouter, useSearchParams,usePathname } from "next/navigation";
  // import { useSearchParams } from "next/navigation";
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
    const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
    const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const [pageKey, setPageKey] = useState(0);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


      const loadCustomers = async () => {
        try {
          const data = await apiFetch<Customer[]>("/customers");
          setCustomers(
            (data ?? []).map((c) => ({
              ...c,
              phone: c.phone ?? "",
            }))
          );
        } catch {
          setCustomers([]);
        }
      };

      const loadRecent = async () => {
        try {
          const data = await apiFetch("/invoices/recent");
          setRecentInvoices(data || []);
        } catch {
          setRecentInvoices([]);
        }
      };

      useEffect(() => {
        loadCustomers();
        loadRecent();
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
              productId: p.productId,
              productName: p.name,
              quantity: p.quantity,
              rate: p.rate,
              amount: p.quantity * p.rate,
            })),
            total: billing.total,
            status: "PENDING",
          }),
        });

        const id = invoice.id || invoice._id;

        setInvoiceNumber(
          invoice.invoiceNo ||
          invoice.invoiceNumber ||
          id
        );

        setLastInvoiceId(id);

        return id;

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

      // alert("Payment successful 🎉");
      setSuccessMessage("Payment successful 🎉");

      await loadRecent();   // 🔥 reload last 5
      // resetBilling();       // 🔥 clear billing form
    setPageKey(prev => prev + 1);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
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
        <div key={pageKey} className="relative px-6 pt-4 pb-12 min-h-screen">
        <div
          className="backdrop-blur-2xl 
          bg-gradient-to-br from-white/10 to-white/5 
          border border-white/20 
          rounded-[32px] 
          shadow-[0_0_60px_rgba(0,0,0,0.4)] 
          p-8 
          text-white space-y-10"
        >
          {successMessage && (
  <div className="bg-green-500/10 border border-green-500/30 text-green-300 
                  rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
    {successMessage}
  </div>
)}
          {/* 🔹 CUSTOMER SECTION */}
          <div className="space-y-6">
            <CustomerSelector
              customers={customers}
              onSelect={setCustomer}
              onAddCustomer={handleAddCustomer}
            />

            {customer && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex justify-between items-center">
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
          </div>

          {/* 🔹 PRODUCT TABLE */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <ProductTable
              key={resetKey}
              onProductsChange={setProducts}
              onBillingChange={setBilling}
            />
          </div>

          {/* 🔹 BILLING + PAYMENT SIDE BY SIDE */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <BillingSummary billing={billing} />
            </div>

            {billing.total > 0 && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <PaymentMethod
                  total={billing.total}
                  loading={loading}
                  onConfirm={handlePayment}
                  onDownload={handleDownload}
                />
              </div>
            )}
          </div>
              {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 
                              rounded-xl px-4 py-3 text-sm font-medium animate-pulse">
                {successMessage}
              </div>
            )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {recentInvoices.map((inv) => (
              <div
                key={inv._id}
                className="group flex flex-col gap-2
                          bg-white/10 backdrop-blur-md
                          border border-white/20
                          rounded-lg px-1 py-1
                          hover:bg-white/20
                          transition-all duration-200"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-200 truncate">
                    {inv.invoiceNo}
                  </span>
                </div>

                {/* Action Row */}
              <div className="flex items-center justify-between gap-2">
                {/* Download */}
                <button
                  onClick={async () => {
                    try {
                      const blob = await apiFetch<Blob>(
                        `/invoices/${inv._id}/pdf`,
                        { method: "GET" },
                        "blob"
                      );

                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Invoice-${inv.invoiceNo}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      alert("Download failed");
                    }
                  }}
                  className="text-xs text-purple-300 hover:text-white
                            bg-gradient-to-r from-purple-500 to-pink-500
                            px-2 py-1 rounded-md transition"
                >
                  ⬇
                </button>

                {/* Status Badge */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    inv.status?.trim().toUpperCase() === "PAID"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {inv.status}
                </span>

                {inv.status?.trim().toUpperCase() === "PENDING" && (
                 <button
                    onClick={() =>
                      router.push(`/dashboard/invoices/${inv._id}`)
                    }
                    className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-500
                              hover:opacity-80 text-white
                              px-2 py-[2px] rounded leading-none transition"
                  >
                    Pay
                  </button>
                )}
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  }
