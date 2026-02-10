"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/server/api";

export default function AddCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India", // ✅ default India
    company: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    /* ================= VALIDATIONS ================= */

    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }

    // Gmail only
    if (!/^[^\s@]+@gmail\.com$/.test(form.email)) {
      setError("Email must be a valid @gmail.com address");
      return;
    }

    // Exactly 10 digits
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/customers", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          company: form.company,
          isActive: form.status === "Active",
        }),
      });

      router.push("/customers");
    } catch (err: any) {
      setError(err.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">New Customer</h1>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Elon Musk"
          />

          <Input
            label="Email (@gmail.com only)"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="elon@gmail.com"
          />

          <Input
            label="Mobile Number"
            type="tel"
            value={form.phone}
            onChange={(v) => {
              const digitsOnly = v.replace(/\D/g, "").slice(0, 10);
              setForm({ ...form, phone: digitsOnly });
            }}
            placeholder="9876543210"
            maxLength={10}
          />

          <Input
            label="Country"
            value={form.country}
            onChange={(v) => setForm({ ...form, country: v })}
            placeholder="India"
          />

          <Input
            label="Company"
            value={form.company}
            onChange={(v) => setForm({ ...form, company: v })}
            placeholder="Starlink"
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => router.back()}
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
