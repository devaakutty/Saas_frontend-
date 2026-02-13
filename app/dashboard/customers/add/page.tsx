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
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/.test(form.email)) {
      setError("Email must be a valid @gmail.com address");
      return;
    }

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
          isActive: form.status === "Active",
        }),
      });

      router.push("/dashboard/customers");
    } catch (err: any) {
      setError(err.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="h-[calc(90vh-100px)] flex items-center justify-center overflow-hidden">

    <div className="w-full max-w-3xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl space-y-8">

      <h1 className="text-2xl font-semibold text-center text-white">
        Add Customer
      </h1>

      {/* ===== FORM GRID ===== */}
      <div className="grid grid-cols-2 gap-6">

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
          onChange={(v) =>
            setForm({
              ...form,
              phone: v.replace(/\D/g, "").slice(0, 10),
            })
          }
          placeholder="9876543210"
          maxLength={10}
        />

        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">
          {error}
        </p>
      )}

      {/* ===== BUTTON ROW ===== */}
      <div className="flex justify-between pt-4 border-t border-white/20">

        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
        >
          Back
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Customer"}
        </button>

      </div>

    </div>
  </div>
);

}

/* ================= INPUT ================= */

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
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      />
    </div>
  );
}
