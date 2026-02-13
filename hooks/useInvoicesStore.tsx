"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ================= TYPES ================= */

export interface InvoiceProduct {
  name: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string; // ✅ ADD THIS

  customer: {
    name: string;
    phone?: string;
  };

  products: InvoiceProduct[];

  billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  };

  payment: {
    method: string;
    provider?: string;
  };
  // status: "PAID" | "UNPAID";
  status: "PAID" | "UNPAID" | "PENDING";
  createdAt: string;
}

/* ================= CONTEXT ================= */

interface InvoiceStoreContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  clearInvoices: () => void;
}

const InvoiceStoreContext =
  createContext<InvoiceStoreContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function InvoiceStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  /* LOAD FROM LOCALSTORAGE */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("invoices");
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch {
        setInvoices([]);
      }
    }
  }, []);

  /* SAVE TO LOCALSTORAGE */
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  /* ADD INVOICE */
  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [
      ...prev,
      {
        ...invoice,
        createdAt: new Date().toISOString(), // always normalize date
      },
    ]);
  };

  /* CLEAR ALL INVOICES */
  const clearInvoices = () => {
    setInvoices([]);
    localStorage.removeItem("invoices");
  };

  return (
    <InvoiceStoreContext.Provider
      value={{ invoices, addInvoice, clearInvoices }}
    >
      {children}
    </InvoiceStoreContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useInvoicesStore() {
  const context = useContext(InvoiceStoreContext);

  if (!context) {
    throw new Error(
      "useInvoicesStore must be used inside InvoiceStoreProvider"
    );
  }

  return context;
}
