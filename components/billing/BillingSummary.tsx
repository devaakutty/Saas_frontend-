export default function BillingSummary({
  billing,
}: {
  billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  };
}) {
  return (
    <div
      className="
        backdrop-blur-2xl
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/20
        rounded-[28px]
        p-6
        shadow-xl
        text-white
        space-y-4
      "
    >
      <h3 className="text-lg font-semibold tracking-tight">
        Billing Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>₹{billing.subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-300">
          <span>Tax (5%)</span>
          <span>₹{billing.tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-300">
          <span>GST (18%)</span>
          <span>₹{billing.gst.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-px bg-white/10 my-2" />

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total</span>
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-xl font-bold">
          ₹{billing.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
