"use client";
import { useState } from "react";

export interface BillItem {
  id: number;
  name: string;
  qty: number;
  rate: number;
}

export function useBilling() {
  const [customer, setCustomer] = useState<any>(null);
  const [items, setItems] = useState<BillItem[]>([]);
  // const [items, setItems] = useState<BillItem[]>([]);
  const [payment, setPayment] = useState<any>(null);

  const subTotal = items.reduce(
    (sum, i) => sum + i.qty * i.rate,
    0
  );

  const tax = subTotal * 0.05;
  const gst = subTotal * 0.18;
  const total = subTotal + tax + gst;

  return {
    customer,
    setCustomer,
    items,
    setItems,
    payment,
    setPayment,
    subTotal,
    tax,
    gst,
    total,
  };
}
