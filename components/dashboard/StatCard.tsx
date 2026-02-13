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

type Props = {
  title: string;
  value?: number;
  type: StatType;
};

export default function StatCard({
  title,
  value = 0,
  type,
}: Props) {
  const iconMap: Record<StatType, React.ReactNode> = {
    totalSales: <IndianRupee size={18} />,
    totalExpense: <Wallet size={18} />,
    pendingPayment: <Clock size={18} />,
    paymentReceived: <CreditCard size={18} />,
  };

  return (
    <div
      className="
        backdrop-blur-xl
        bg-white/10
        border border-white/20
        rounded-[24px]
        p-6
        shadow-xl
        hover:scale-[1.03]
        transition-all duration-300
        text-white
      "
    >
      {/* Icon */}
      <div
        className="
          w-10 h-10
          rounded-lg
          flex items-center justify-center
          bg-purple-500/20
          text-purple-400
        "
      >
        {iconMap[type]}
      </div>

      {/* Title */}
      <p className="text-sm text-white/60 mt-4">
        {title}
      </p>

      {/* Value */}
      <p className="text-2xl font-bold mt-1">
        ₹{Number(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
