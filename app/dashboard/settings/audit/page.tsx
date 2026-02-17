"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


/* ================= TYPES ================= */

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  ip: string;
  createdAt: string;
}

/* ================= PAGE ================= */

export default function AuditLogsPage() {
  const { isAuthenticated, user } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();


  const isPremium =
    user?.plan === "pro" || user?.plan === "business";

  /* ================= LOAD LOGS ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadLogs();
  }, [isAuthenticated]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      setLogs([
        {
          id: "1",
          action: "Logged in",
          resource: "Authentication",
          ip: "192.168.1.10",
          createdAt: "2024-02-15 09:30 AM",
        },
        {
          id: "2",
          action: "Updated profile",
          resource: "User settings",
          ip: "192.168.1.10",
          createdAt: "2024-02-14 06:10 PM",
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return <div className="p-8 text-white/60">Loading audit logs…</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-8 text-white/60">Please log in.</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-14 text-white max-w-6xl">

      {/* HEADER */}
      <div>
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
          Activity{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Audit Logs
          </span>
        </h1>

        <p className="mt-4 text-white/70 text-lg">
          Track system and user activity.
        </p>
      </div>

      {/* ================= PREMIUM COMPANY DETAILS ================= */}

      {isPremium && (
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-[28px] p-8 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-6">
            Premium Support & Company Info
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-white/80">
          <div>
              <p className="text-sm text-white/60">
                Company Name
              </p>

              <p className="font-medium text-purple-300">
                🏢 {user?.company || "N/A"}
              </p>
            </div>
            <div>
                <a
              href="mailto:moyo@gmail.com"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition"
            >
              📧 Email Support
            </a>
            </div>
            <div>
              <p className="text-sm text-white/60">
                24/7 Support Phone
              </p>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30 transition"
              >
                📞 Call Support
              </a>
            </div>
            <div>
              <p className="text-sm text-white/60">
                Live Office Location
              </p>

              <a
                href="https://share.google/shbqqMtMjvuBsBADN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-medium text-purple-400 hover:text-pink-400 transition"
              >
                📍 Pallavaram, Chennai, Tamil Nadu 🇮🇳
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= STARTER LOCK MESSAGE ================= */}

{!isPremium && (
  <div className="bg-white/5 border border-white/10 rounded-[28px] p-8 text-center space-y-6">

    <p className="text-white/70">
      Premium audit insights and support details
      are available on Pro & Business plans.
    </p>

    <button
      onClick={() => router.push("/dashboard/settings/company")}
      className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
    >
      🚀 Upgrade Plan
    </button>

  </div>
)}


      {/* ================= AUDIT TABLE ================= */}

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-6 text-left">Action</th>
              <th className="p-6 text-left">Resource</th>
              <th className="p-6 text-center">IP</th>
              <th className="p-6 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-white/10 hover:bg-white/10"
              >
                <td className="p-6">{log.action}</td>
                <td className="p-6 text-white/70">{log.resource}</td>
                <td className="p-6 text-center text-white/60">
                  {log.ip}
                </td>
                <td className="p-6 text-center text-white/60">
                  {log.createdAt}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
