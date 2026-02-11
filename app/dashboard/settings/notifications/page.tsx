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
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Notification Settings
      </h1>

      <div className="bg-[#11141c] border border-white/10 rounded-xl p-6 space-y-5">
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
          description="New features and product announcements"
          checked={settings.productUpdates}
          onChange={() => toggle("productUpdates")}
        />

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save preferences"}
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
    <div className="flex items-center justify-between border border-white/10 rounded-lg p-4">
      <div>
        <p className="text-white font-medium">
          {title}
        </p>
        <p className="text-sm text-gray-400">
          {description}
        </p>
      </div>

      {/* Accessible toggle */}
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition ${
          checked ? "bg-indigo-500" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
