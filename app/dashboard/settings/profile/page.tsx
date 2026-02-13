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
  <div className="space-y-10 text-white">

    {/* HEADER */}
    <div>
      <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
        Profile{" "}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </span>
      </h1>

      <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
        Update your personal and company information.
      </p>
    </div>

    {/* FORM CARD */}
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-10 space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <GlassInput label="First Name" value={form.firstName} onChange={(v) => handleChange("firstName", v)} />
        <GlassInput label="Last Name" value={form.lastName} onChange={(v) => handleChange("lastName", v)} />
        <GlassInput label="Email" value={form.email} disabled />
        <GlassInput label="Phone" value={form.phone} maxLength={10} onChange={(v) => handleChange("phone", v.replace(/\D/g, ""))} />
        <GlassInput label="Company" value={form.company} onChange={(v) => handleChange("company", v)} />
        <GlassInput label="Website" value={form.website} onChange={(v) => handleChange("website", v)} />
        <GlassInput label="GST Number" value={form.gstNumber} onChange={(v) => handleChange("gstNumber", v)} />
        <GlassInput label="Country" value="India" disabled />

        <GlassSelect
          label="State"
          value={form.state}
          options={Object.keys(STATES)}
          onChange={(v) => handleChange("state", v)}
        />

        <GlassSelect
          label="City"
          value={form.city}
          options={cities}
          disabled={!form.state}
          onChange={(v) => handleChange("city", v)}
        />

        <GlassInput label="Zip Code" value={form.zip} onChange={(v) => handleChange("zip", v)} />
      </div>

      <GlassTextarea
        label="Address"
        value={form.address}
        onChange={(v) => handleChange("address", v)}
      />

      <div className="flex justify-end pt-6 border-t border-white/10">
        <button
          disabled={saving}
          onClick={handleSave}
          className="px-8 py-3 rounded-[18px] bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  </div>
);

}

/* ================= COMPONENTS ================= */
function GlassInput({
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
      <label className="block text-sm mb-2 text-white/60 font-[var(--font-inter)]">
        {label}
      </label>
      <input
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition disabled:opacity-60"
      />
    </div>
  );
}

///* ================= SELECT ================= */
function GlassSelect({
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
      <label className="block text-sm mb-2 text-white/60 font-[var(--font-inter)]">
        {label}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition disabled:opacity-60"
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
function GlassTextarea({
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
      <label className="block text-sm mb-2 text-white/60 font-[var(--font-inter)]">
        {label}
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
      />
    </div>
  );
}


