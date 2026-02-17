"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  onDownload?: () => void;
}

/* ================= COMPONENT ================= */

export default function PaymentMethod({
  total,
  loading = false,
  onConfirm,
  onDownload,
}: PaymentMethodProps) {
  const { user } = useAuth();

  const [method, setMethod] = useState<PaymentMethodType | null>(null);
  const [upiApp, setUpiApp] =
    useState<"GPay" | "PhonePe" | "Paytm">("GPay");

  const [cashPart, setCashPart] = useState(0);

  // 🔥 Card states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const isBusiness = user?.plan === "business";

  const upiAmount = Math.max(total - cashPart, 0);

  /* ================= RESET ON METHOD CHANGE ================= */

  useEffect(() => {
    setCashPart(0);
    setUpiApp("GPay");
    setCardNumber("");
    setExpiry("");
    setCvv("");
  }, [method]);

  /* ================= CARD VALIDATION ================= */

  const handleCardPayment = () => {
    if (!isBusiness) {
      alert("Upgrade to Business Plan to use card payments.");
      return;
    }

    if (cardNumber.length !== 16) {
      alert("Enter valid 16-digit card number");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Enter expiry in MM/YY format");
      return;
    }

    if (cvv.length !== 3) {
      alert("Enter valid 3-digit CVV");
      return;
    }

    onConfirm("CARD", {
      provider: "CARD",
      amount: total,
    });
  };

  /* ================= UI ================= */

  return (
    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-[28px] p-6 space-y-6 shadow-xl text-white">

      <h3 className="text-lg font-semibold tracking-tight">
        Payment Method
      </h3>

      {/* ================= METHOD SELECT ================= */}

      <div className="flex gap-3">
        {(["CASH", "UPI", "CARD"] as PaymentMethodType[]).map((m) => (
          <button
            key={m}
            disabled={loading}
            onClick={() => setMethod(m)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              method === m
                ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                : "bg-white/10 hover:bg-white/20 border border-white/20"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ================= CASH ================= */}

      {method === "CASH" && (
        <button
          disabled={loading}
          onClick={() => onConfirm("CASH", { amount: total })}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          Confirm Cash Payment ₹{total}
        </button>
      )}

      {/* ================= UPI ================= */}

      {method === "UPI" && (
        <div className="space-y-5">

          <div className="flex gap-3">
            {(["GPay", "PhonePe", "Paytm"] as const).map((app) => (
              <button
                key={app}
                disabled={loading}
                onClick={() => setUpiApp(app)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  upiApp === app
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                }`}
              >
                {app}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/5 p-6">
            <img
              src="/qr.png"
              alt="UPI QR"
              className="w-40 h-40 object-contain rounded-xl"
            />
            <p className="text-sm text-gray-300 mt-3">
              Scan with <b>{upiApp}</b>
            </p>
            <p className="text-2xl font-semibold mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ₹{upiAmount}
            </p>
          </div>

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
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Confirm UPI Payment ₹{total}
          </button>
        </div>
      )}

      {/* ================= CARD ================= */}

      {method === "CARD" && (
        <div className="space-y-4">

          {!isBusiness && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-sm text-red-300">
              Card payments are available only in Business Plan.
            </div>
          )}

          <input
            placeholder="Card Number (16 digits)"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            disabled={!isBusiness}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 disabled:opacity-50"
          />

          <input
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            disabled={!isBusiness}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 disabled:opacity-50"
          />

          <input
            placeholder="CVV (3 digits)"
            type="password"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            disabled={!isBusiness}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 disabled:opacity-50"
          />

          <button
            disabled={!isBusiness || loading}
            onClick={handleCardPayment}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
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
          className="w-full py-3 rounded-xl text-sm font-semibold border border-white/30 bg-white/5 hover:bg-white/10 transition-all"
        >
          Download Invoice (No Payment)
        </button>
      )}
    </div>
  );
}
