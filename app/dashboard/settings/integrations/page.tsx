"use client";

import { useState } from "react";

type IntegrationKey = "razorpay" | "email" | "gst" | "webhook";

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<
    Record<IntegrationKey, boolean>
  >({
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
    <div className="space-y-14 text-white max-w-5xl">

      {/* HEADER */}
      <div>
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
          Platform{" "}
          <span className="font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Integrations
          </span>
        </h1>

        <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
          Connect external services to extend your dashboard capabilities.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-10 space-y-6">

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
          description="Receive real-time events"
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10 rounded-[20px] p-6 bg-white/5 hover:bg-white/10 transition-all duration-300">

      <div>
        <p className="font-semibold text-white text-lg">{name}</p>
        <p className="text-sm text-white/60">{description}</p>
      </div>

      <div className="flex items-center gap-6">

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full relative transition ${
            enabled ? "bg-primary" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition-all duration-300 ${
              enabled ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>

        {/* Action */}
        {enabled ? (
          <button
            onClick={onManage}
            className="px-5 py-2 text-sm bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition"
          >
            Manage
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="px-5 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-xl transition"
          >
            Connect
          </button>
        )}

      </div>
    </div>
  );
}
