"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

export default function CreateUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CREATE TEAM MEMBER ================= */

  const handleCreateUser = async () => {
    if (loading) return; // 🔥 prevent double click

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 🔴 VALIDATIONS

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/users/team-members", {
        method: "POST",
        body: JSON.stringify({
          firstName: trimmedName,
          email: trimmedEmail,
          password,
          phone: phone || undefined,
        }),
      });

      alert("Team member created successfully ✅");

      router.push("/dashboard/settings/security");
    } catch (err: unknown) {
      let message = "Failed to create user";

      if (err instanceof Error) {
        message = err.message;
      }

      // 🔥 PLAN LIMIT HANDLING
      if (message.toLowerCase().includes("upgrade")) {
        setError("PLAN_LIMIT");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">
          Create Team Member
        </h1>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">

        {/* 🔥 ERROR HANDLING UI */}
        {error === "PLAN_LIMIT" ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded space-y-3">
            <p className="text-sm text-yellow-700 font-medium">
              Your current plan does not allow adding more team members.
            </p>

            <button
              onClick={() => router.push("/dashboard/settings/company")}
              className="px-4 py-2 bg-black text-white rounded text-sm"
            >
              Upgrade Plan
            </button>
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : null}

        {/* NAME */}
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* MOBILE */}
        <input
          placeholder="Mobile number (10 digits)"
          type="tel"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          maxLength={10}
          className="w-full border p-2 rounded"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateUser}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
