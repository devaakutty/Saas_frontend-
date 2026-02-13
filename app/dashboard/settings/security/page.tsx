"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

export default function SecuritySettingsPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/security/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/security/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (err: any) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY & DELETE ================= */

  const verifyAndDelete = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/security/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      });

      await apiFetch("/security/delete-account", {
        method: "DELETE",
      });

      localStorage.removeItem("token");

      // ✅ Proper Next.js redirect
      router.replace("/login");
    } catch (err: any) {
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);
  };

  /* ================= UI ================= */
return (
  <div className="space-y-16 text-white max-w-4xl">

    {/* HEADER */}
    <div className="flex justify-between items-start">
      <div>
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
          Account{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Security
          </span>
        </h1>

        <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
          Manage your password and account protection settings.
        </p>
      </div>

      <button
        onClick={() =>
          router.push("/dashboard/settings/create-user")
        }
        className="px-6 py-3 rounded-[18px] bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
      >
        + Create User
      </button>
    </div>

    {/* ================= CHANGE PASSWORD ================= */}

    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-10 space-y-6">

      <h2 className="font-[var(--font-playfair)] text-2xl">
        Change Password
      </h2>

      <GlassInput
        placeholder="Current password"
        value={currentPassword}
        onChange={setCurrentPassword}
        type="password"
      />

      <GlassInput
        placeholder="New password"
        value={newPassword}
        onChange={setNewPassword}
        type="password"
      />

      <GlassInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        type="password"
      />

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="px-8 py-3 rounded-[18px] bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>

    {/* ================= DELETE ACCOUNT ================= */}

    <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-md border border-red-400/20 rounded-[28px] p-10 space-y-6">

      <h2 className="font-[var(--font-playfair)] text-2xl text-red-400">
        Delete Account
      </h2>

      <p className="text-white/60 text-sm">
        This action is permanent and cannot be undone.
      </p>

      <GlassInput
        placeholder="Mobile number"
        value={phone}
        onChange={(v) =>
          setPhone(v.replace(/\D/g, "").slice(0, 10))
        }
        maxLength={10}
      />

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="px-8 py-3 rounded-[18px] bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      ) : (
        <>
          <GlassInput
            placeholder="Enter OTP"
            value={otp}
            onChange={setOtp}
          />

          <div className="flex gap-4">
            <button
              onClick={verifyAndDelete}
              disabled={loading}
              className="px-8 py-3 rounded-[18px] bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Verify & Delete"}
            </button>

            <button
              onClick={cancelDelete}
              className="px-8 py-3 rounded-[18px] bg-white/10 hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

}


function GlassInput({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-[18px] px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
    />
  );
}
