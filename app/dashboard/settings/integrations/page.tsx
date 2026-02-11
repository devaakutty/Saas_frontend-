"use client";

import { useState } from "react";

type IntegrationKey = "razorpay" | "email" | "gst" | "webhook";

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Record<IntegrationKey, boolean>>({
    razorpay: false,
    email: true,
    gst: false,
    webhook: false,
  });

  const toggle = (key: IntegrationKey) => {
    setIntegrations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const connect = (name: string) => {
    alert(`${name} integration connected (demo)`);
  };

  const manage = (name: string) => {
    alert(`Manage ${name} settings (demo)`);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-8 rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Integrations</h1>

      <div className="bg-[#11141c] border border-white/10 rounded-xl p-6 max-w-4xl space-y-6">
        <IntegrationItem
          name="Razorpay"
          description="Accept payments via cards, UPI, wallets"
          enabled={integrations.razorpay}
          onToggle={() => toggle("razorpay")}
          onConnect={() => connect("Razorpay")}
          onManage={() => manage("Razorpay")}
        />

        <IntegrationItem
          name="Email (SMTP)"
          description="Send invoices and notifications via email"
          enabled={integrations.email}
          onToggle={() => toggle("email")}
          onConnect={() => connect("Email")}
          onManage={() => manage("Email")}
        />

        <IntegrationItem
          name="GST API"
          description="Validate GST numbers & generate reports"
          enabled={integrations.gst}
          onToggle={() => toggle("gst")}
          onConnect={() => connect("GST")}
          onManage={() => manage("GST")}
        />

        <IntegrationItem
          name="Webhooks"
          description="Receive real-time events from QuickBillz"
          enabled={integrations.webhook}
          onToggle={() => toggle("webhook")}
          onConnect={() => connect("Webhooks")}
          onManage={() => manage("Webhooks")}
        />
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function IntegrationItem({
  name,
  description,
  enabled,
  onToggle,
  onConnect,
  onManage,
}: {
  name: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  onConnect: () => void;
  onManage: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10 rounded-lg p-4">
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`w-11 h-6 rounded-full relative transition ${
            enabled ? "bg-indigo-500" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition ${
              enabled ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>

        {/* Action */}
        {enabled ? (
          <button
            onClick={onManage}
            className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 rounded"
          >
            Manage
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
