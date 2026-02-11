"use client";

import {
  IndianRupee,
  Wallet,
  CreditCard,
  Clock,
} from "lucide-react";

type StatType =
  | "totalSales"
  | "totalExpense"
  | "pendingPayment"
  | "paymentReceived";

export default function StatCard({
  title,
  value = 0,
  type,
}: {
  title: string;
  value?: number;
  type: StatType;
}) {
  const iconMap: Record<StatType, React.ReactNode> = {
    totalSales: <IndianRupee size={18} />,
    totalExpense: <Wallet size={18} />,
    pendingPayment: <Clock size={18} />,
    paymentReceived: <CreditCard size={18} />,
  };

  const colorMap: Record<StatType, string> = {
    totalSales: "bg-purple-100 text-purple-700",
    totalExpense: "bg-blue-100 text-blue-700",
    pendingPayment: "bg-orange-100 text-orange-700",
    paymentReceived: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[type]}`}
      >
        {iconMap[type]}
      </div>

      {/* Title */}
      <p className="text-sm text-gray-500 mt-3">
        {title}
      </p>

      {/* Value */}
      <p className="text-2xl font-bold mt-1">
        ₹{Number(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
