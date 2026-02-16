"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export type PaymentMethodType = "CASH" | "UPI" | "CARD";

export default function PaymentSelector({
  onChange,
}: {
  onChange: (payment: {
    method: PaymentMethodType;
    provider?: string;
  }) => void;
}) {
  const { user } = useAuth();

  const [method, setMethod] = useState<PaymentMethodType>("CASH");
  const [provider, setProvider] = useState("");

  const allowedMethods: PaymentMethodType[] =
    user?.plan === "business"
      ? ["CASH", "UPI", "CARD"]
      : ["CASH", "UPI"];

  const handleSelect = (m: PaymentMethodType) => {
    setMethod(m);
    onChange({
      method: m,
      provider: m === "CASH" ? undefined : provider,
    });
  };

  return (
    <div
      className="
        backdrop-blur-2xl
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/20
        rounded-[28px]
        p-6
        space-y-6
        shadow-xl
        text-white
      "
    >
      <h3 className="text-lg font-semibold tracking-tight">
        Select Payment Method
      </h3>

      {/* ================= METHOD BUTTONS ================= */}
      <div className="flex gap-3">
        {allowedMethods.map((m) => (
          <button
            key={m}
            onClick={() => handleSelect(m)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300
              ${
                method === m
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-[1.03]"
                  : "bg-white/10 hover:bg-white/20 border border-white/20"
              }
            `}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ================= PROVIDER INPUT ================= */}
      {(method === "UPI" || method === "CARD") && (
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            {method === "UPI" ? "UPI App" : "Card Provider"}
          </label>

          <input
            placeholder={
              method === "UPI"
                ? "e.g. GPay / PhonePe"
                : "e.g. Visa / Mastercard"
            }
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              onChange({ method, provider: e.target.value });
            }}
            className="
              w-full px-4 py-2.5 rounded-xl
              bg-white/10 border border-white/20
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-400
              transition
            "
          />
        </div>
      )}
    </div>
  );
}
