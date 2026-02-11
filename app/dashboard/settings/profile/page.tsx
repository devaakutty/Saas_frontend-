"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= DATA ================= */

const STATES = {
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Trichy",
    "Tirunelveli",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Karimnagar",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
  ],
};

/* ================= TYPES ================= */

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  gstNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
};

/* ================= PAGE ================= */

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // ✅ FIX

  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================= AUTH ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    loadProfile();
  }, [isAuthenticated, router]);

  /* ================= LOAD PROFILE ================= */

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await apiFetch<any>("/users/me");

      setForm({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        company: data.company ?? "",
        website: data.website ?? "",
        gstNumber: data.gstNumber ?? "",
        address: data.address ?? "",
        country: "India",
        state: data.state ?? "",
        city: data.city ?? "",
        zip: data.zip ?? "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHANGE HANDLER ================= */

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      if (key === "state") {
        return { ...prev, state: value, city: "" };
      }

      return { ...prev, [key]: value };
    });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form) return;

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setSaving(true);

      await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      await loadProfile();
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return <div className="p-6 text-gray-500">Loading profile…</div>;
  }

  if (error || !form) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const cities = form.state
    ? STATES[form.state as keyof typeof STATES]
    : [];

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="First Name"
          value={form.firstName}
          onChange={(v) => handleChange("firstName", v)}
        />

        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(v) => handleChange("lastName", v)}
        />
       <Input label="Email" value={form.email} disabled />

          <Input
            label="Phone"
            value={form.phone}
            maxLength={10}
            onChange={(v) =>
              handleChange("phone", v.replace(/\D/g, ""))
            }
          />

          <Input label="Company" value={form.company} onChange={(v) => handleChange("company", v)} />
          <Input label="Website" value={form.website} onChange={(v) => handleChange("website", v)} />
          <Input label="GST Number" value={form.gstNumber} onChange={(v) => handleChange("gstNumber", v)} />

          <Input label="Country" value="India" disabled />

          <Select
            label="State"
            value={form.state}
            options={Object.keys(STATES)}
            onChange={(v) => handleChange("state", v)}
          />

          <Select
            label="City"
            value={form.city}
            options={cities}
            disabled={!form.state}
            onChange={(v) => handleChange("city", v)}
          />

          <Input label="Zip Code" value={form.zip} onChange={(v) => handleChange("zip", v)} />
        </div>

        <Textarea
          label="Address"
          value={form.address}
          onChange={(v) => handleChange("address", v)}
        />

        <div className="flex justify-end pt-4 border-t">
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

    function Input({
      label,
      value,
      onChange,
      disabled = false,
      maxLength,
    }: {
      label: string;
      value: string;
      onChange?: (value: string) => void;
      disabled?: boolean;
      maxLength?: number;
    }) {
      return (
        <div>
          <label className="block text-sm mb-1 text-gray-600">{label}</label>
          <input
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              disabled ? "bg-gray-100" : "focus:ring-2 focus:ring-orange-400"
            }`}
          />
        </div>
      );
    }
///* ================= SELECT ================= */
    function Select({
      label,
      value,
      options = [],
      onChange,
      disabled = false,
    }: {
      label: string;
      value: string;
      options?: string[];
      disabled?: boolean;
      onChange: (v: string) => void;
    }) {
      return (
        <div>
          <label className="block text-sm mb-1 text-gray-600">{label}</label>
          <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    }
//* ================= TEXTAREA ================= */
    function Textarea({
      label,
      value,
      onChange,
    }: {
      label: string;
      value: string;
      onChange?: (value: string) => void;
    }) {
      return (
        <div>
          <label className="block text-sm mb-1 text-gray-600">{label}</label>
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
          />
        </div>
      );
    }

