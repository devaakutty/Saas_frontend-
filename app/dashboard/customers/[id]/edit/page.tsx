"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

interface Customer {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  company?: string;
  isActive?: boolean;
}

/* ================= PAGE ================= */

export default function CustomerEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    company: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD CUSTOMER ================= */

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await apiFetch<Customer>(`/customers/${id}`);

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.country || "",
          company: data.company || "",
          status: data.isActive === false ? "Inactive" : "Active",
        });
      } catch (err: any) {
        setError(err.message || "Customer not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCustomer();
  }, [id]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setError(null);

    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }

    try {
      setSaving(true);

      await apiFetch(`/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          company: form.company,
          isActive: form.status === "Active",
        }),
      });

      // ✅ CORRECT ROUTE
      router.push(`/dashboard/customers`);

    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-white">
        Loading customer...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="px-8 py-12">

      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-xl space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push(`/dashboard/customers/${id}`)}
            className="text-sm text-purple-300 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-white">
            Edit Customer
          </h1>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) =>
              setForm({
                ...form,
                phone: v.replace(/\D/g, "").slice(0, 10),
              })
            }
          />

          <Input
            label="Country"
            value={form.country}
            onChange={(v) => setForm({ ...form, country: v })}
          />

          <Input
            label="Company"
            value={form.company}
            onChange={(v) => setForm({ ...form, company: v })}
          />

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-6 border-t border-white/10">

          <button
            onClick={() => router.push(`/dashboard/customers/${id}`)}
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      />
    </div>
  );
}
