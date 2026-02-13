"use client";

import { useState } from "react";
// import { apiFetch } from "@/server/api"; // 🔜 enable later

type NotificationSettings = {
  invoiceCreated: boolean;
  paymentReceived: boolean;
  paymentFailed: boolean;
  monthlyReport: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
};

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    invoiceCreated: true,
    paymentReceived: true,
    paymentFailed: false,
    monthlyReport: true,
    securityAlerts: true,
    productUpdates: false,
  });

  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 🔜 Backend later
      // await apiFetch("/settings/notifications", {
      //   method: "PUT",
      //   body: JSON.stringify(settings),
      // });

      alert("Notification preferences saved ✅");
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
return (
  <div className="space-y-12 text-white max-w-4xl">

    {/* HEADER */}
    <div>
      <h1 className="font-[var(--font-playfair)] text-[36px] leading-[0.95] tracking-tight">
        Notification{" "}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
        Control how and when you receive alerts from the system.
      </p>
    </div>

    {/* CARD */}
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-10 space-y-6">

      <NotificationItem
        title="Invoice created"
        description="Notify me when a new invoice is created"
        checked={settings.invoiceCreated}
        onChange={() => toggle("invoiceCreated")}
      />

      <NotificationItem
        title="Payment received"
        description="Get alerts when a payment is successful"
        checked={settings.paymentReceived}
        onChange={() => toggle("paymentReceived")}
      />

      <NotificationItem
        title="Payment failed"
        description="Notify me when a payment fails"
        checked={settings.paymentFailed}
        onChange={() => toggle("paymentFailed")}
      />

      <NotificationItem
        title="Monthly report"
        description="Receive monthly sales and GST summary"
        checked={settings.monthlyReport}
        onChange={() => toggle("monthlyReport")}
      />

      <NotificationItem
        title="Security alerts"
        description="Suspicious login or password changes"
        checked={settings.securityAlerts}
        onChange={() => toggle("securityAlerts")}
      />

      <NotificationItem
        title="Product updates"
        description="New features and announcements"
        checked={settings.productUpdates}
        onChange={() => toggle("productUpdates")}
      />

      <div className="flex justify-end pt-6 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-[18px] bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

    </div>
  </div>
);

}

/* ================= TOGGLE ITEM ================= */

function NotificationItem({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-6 rounded-[20px] bg-white/5 border border-white/10 hover:bg-white/10 transition">

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>
        <p className="text-sm text-white/60 mt-1">
          {description}
        </p>
      </div>

      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          checked
            ? "bg-gradient-to-r from-purple-500 to-pink-500"
            : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 bg-white rounded-full transition-transform duration-300 ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>

    </div>
  );
}

