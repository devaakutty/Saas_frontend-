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
    <div className="bg-white rounded-xl p-4 space-y-4 shadow">
      <h3 className="font-semibold text-lg">
        Payment Method
      </h3>

      {/* ================= METHOD SELECT ================= */}
      <div className="flex gap-2">
        {(["CASH", "UPI", "CARD"] as PaymentMethodType[]).map(
          (m) => (
            <button
              key={m}
              disabled={loading}
              onClick={() => setMethod(m)}
              className={`px-4 py-2 rounded border text-sm font-medium ${
                method === m
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
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
          className="w-full bg-black text-white py-2 rounded"
        >
          Confirm Cash Payment ₹{total}
        </button>
      )}

      {/* ================= UPI ================= */}
      {method === "UPI" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["GPay", "PhonePe", "Paytm"] as const).map(
              (app) => (
                <button
                  key={app}
                  disabled={loading}
                  onClick={() => setUpiApp(app)}
                  className={`px-3 py-1 rounded border text-sm ${
                    upiApp === app
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {app}
                </button>
              )
            )}
          </div>

          <div className="flex flex-col items-center border rounded-lg p-4">
            <img
              src="/qr.png"
              alt="UPI QR"
              className="w-40 h-40 object-contain"
            />

            <p className="text-sm text-gray-600 mt-2">
              Scan with <b>{upiApp}</b> or any UPI app
            </p>

            <p className="text-lg font-semibold mt-1">
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
            className="w-full border px-3 py-2 rounded"
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
            className="w-full bg-black text-white py-2 rounded"
          >
            Confirm UPI Payment ₹{total}
          </button>
        </div>
      )}

      {/* ================= CARD ================= */}
      {method === "CARD" && (
        <div className="space-y-3">
          <input
            placeholder="Card Number"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Expiry (MM/YY)"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="CVV"
            type="password"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            disabled={loading}
            onClick={() =>
              onConfirm("CARD", {
                provider: "CARD",
                amount: total,
              })
            }
            className="w-full bg-black text-white py-2 rounded"
          >
            Pay ₹{total} by Card
          </button>
        </div>
      )}

      {/* ================= DOWNLOAD (OPTIONAL) ================= */}
      {onDownload && (
        <button
          disabled={loading}
          onClick={onDownload}
          className="w-full border border-black py-2 rounded text-sm font-medium"
        >
          Download Invoice (No Payment)
        </button>
      )}
    </div>
  );
}
