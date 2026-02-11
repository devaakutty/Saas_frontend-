"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  company?: string;
  isActive?: boolean;
}

/* ================= PAGE ================= */

export default function CustomerEditPage() {
  const params = useParams();
  const id = params.id as string;

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
    apiFetch<Customer>(`/customers/${id}`)
      .then((data) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.country || "",
          company: data.company || "",
          status: data.isActive === false ? "Inactive" : "Active",
        });
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Customer not found");
        }
      })
      .finally(() => setLoading(false));
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

      router.push(`/customers/${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save changes");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <p className="text-center py-24">
        Loading customer...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-red-600 font-medium">
          {error}
        </p>

        <button
          onClick={() => router.push("/customers")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Back to Customers
        </button>
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold">
          Edit Customer
        </h1>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) =>
              setForm({ ...form, name: v })
            }
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v) =>
              setForm({ ...form, email: v })
            }
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) =>
              setForm({ ...form, phone: v })
            }
          />

          <Input
            label="Country"
            value={form.country}
            onChange={(v) =>
              setForm({ ...form, country: v })
            }
          />

          <Input
            label="Company"
            value={form.company}
            onChange={(v) =>
              setForm({ ...form, company: v })
            }
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">
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
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => router.back()}
            className="px-5 py-2 border rounded-lg text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
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
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
