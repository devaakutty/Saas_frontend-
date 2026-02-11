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
    <div className="max-w-3xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security</h1>

        {/* ✅ FIXED PATH */}
        <button
          onClick={() =>
            router.push("/dashboard/settings/create-user")
          }
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create User
        </button>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Change Password</h2>

        <input
          placeholder="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* ================= DELETE ACCOUNT ================= */}

      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-red-600">
          Delete Account
        </h2>

        <input
          placeholder="Mobile number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          maxLength={10}
          className="w-full border p-2 rounded"
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-3">
              <button
                onClick={verifyAndDelete}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Verify & Delete"}
              </button>

              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
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
