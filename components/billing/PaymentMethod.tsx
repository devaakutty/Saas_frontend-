"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

export type PaymentMethodType = "CASH" | "UPI" | "CARD";

export type PaymentDetails = {
  provider?: string;
  amount: number;
  cashAmount?: number;
  upiAmount?: number;
};

/* ================= PROPS ================= */

interface PaymentMethodProps {
  total: number;
  loading?: boolean;
  onConfirm: (
    method: PaymentMethodType,
    details: PaymentDetails
  ) => void;
  onDownload?: () => void; // ✅ OPTIONAL (THIS IS THE FIX)
}

/* ================= COMPONENT ================= */

export default function PaymentMethod({
  total,
  loading = false,
  onConfirm,
  onDownload,
}: PaymentMethodProps) {
  const [method, setMethod] =
    useState<PaymentMethodType | null>(null);

  const [upiApp, setUpiApp] =
    useState<"GPay" | "PhonePe" | "Paytm">("GPay");

  const [cashPart, setCashPart] = useState(0);

  const upiAmount = Math.max(total - cashPart, 0);

  useEffect(() => {
    setCashPart(0);
    setUpiApp("GPay");
  }, [method]);

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
      Payment Method
    </h3>

    {/* ================= METHOD SELECT ================= */}
    <div className="flex gap-3">
      {(["CASH", "UPI", "CARD"] as PaymentMethodType[]).map(
        (m) => (
          <button
            key={m}
            disabled={loading}
            onClick={() => setMethod(m)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${
                method === m
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                  : "bg-white/10 hover:bg-white/20 border border-white/20"
              }
            `}
          >
            {m}
          </button>
        )
      )}
    </div>

    {/* ================= CASH ================= */}
    {method === "CASH" && (
      <button
        disabled={loading}
        onClick={() =>
          onConfirm("CASH", { amount: total })
        }
        className="
          w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-purple-500 to-pink-500
          hover:scale-[1.02]
          transition-all duration-300 shadow-lg
        "
      >
        Confirm Cash Payment ₹{total}
      </button>
    )}

    {/* ================= UPI ================= */}
    {method === "UPI" && (
      <div className="space-y-5">

        {/* UPI App Selector */}
        <div className="flex gap-3">
          {(["GPay", "PhonePe", "Paytm"] as const).map(
            (app) => (
              <button
                key={app}
                disabled={loading}
                onClick={() => setUpiApp(app)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition
                  ${
                    upiApp === app
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }
                `}
              >
                {app}
              </button>
            )
          )}
        </div>

        {/* QR Card */}
        <div
          className="
            flex flex-col items-center
            rounded-2xl
            border border-white/20
            bg-white/5
            p-6
          "
        >
          <img
            src="/qr.png"
            alt="UPI QR"
            className="w-40 h-40 object-contain rounded-xl"
          />

          <p className="text-sm text-gray-300 mt-3">
            Scan with <b>{upiApp}</b> or any UPI app
          </p>

          <p className="text-2xl font-semibold mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ₹{upiAmount}
          </p>
        </div>

        <input
          type="number"
          min={0}
          max={total}
          placeholder="Cash part (optional)"
          value={cashPart}
          onChange={(e) =>
            setCashPart(
              Math.min(Number(e.target.value) || 0, total)
            )
          }
          className="
            w-full px-4 py-2.5 rounded-xl
            bg-white/10 border border-white/20
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        />

        <button
          disabled={loading}
          onClick={() =>
            onConfirm("UPI", {
              provider: upiApp,
              cashAmount: cashPart,
              upiAmount,
              amount: total,
            })
          }
          className="
            w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:scale-[1.02]
            transition-all duration-300 shadow-lg
          "
        >
          Confirm UPI Payment ₹{total}
        </button>
      </div>
    )}

    {/* ================= CARD ================= */}
    {method === "CARD" && (
      <div className="space-y-4">

        <input
          placeholder="Card Number"
          className="
            w-full px-4 py-2.5 rounded-xl
            bg-white/10 border border-white/20
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        />

        <input
          placeholder="Expiry (MM/YY)"
          className="
            w-full px-4 py-2.5 rounded-xl
            bg-white/10 border border-white/20
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        />

        <input
          placeholder="CVV"
          type="password"
          className="
            w-full px-4 py-2.5 rounded-xl
            bg-white/10 border border-white/20
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        />

        <button
          disabled={loading}
          onClick={() =>
            onConfirm("CARD", {
              provider: "CARD",
              amount: total,
            })
          }
          className="
            w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:scale-[1.02]
            transition-all duration-300 shadow-lg
          "
        >
          Pay ₹{total} by Card
        </button>
      </div>
    )}

    {/* ================= DOWNLOAD ================= */}
    {onDownload && (
      <button
        disabled={loading}
        onClick={onDownload}
        className="
          w-full py-3 rounded-xl text-sm font-semibold
          border border-white/30
          bg-white/5
          hover:bg-white/10
          transition-all
        "
      >
        Download Invoice (No Payment)
      </button>
    )}
  </div>
);

}
