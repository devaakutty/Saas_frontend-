"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  const { isAuthenticated } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      // Demo Data
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
        {
          id: "3",
          action: "Created invoice",
          resource: "INV-1023",
          ip: "192.168.1.10",
          createdAt: "2024-02-14 11:20 AM",
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
    return (
      <div className="p-8 text-white/60">
        Loading audit logs…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-white/60">
        Please log in to view audit logs.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-14 text-white max-w-6xl">

      {/* HEADER */}
      <div>
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
          Activity{" "}
          <span className="font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Audit Logs
          </span>
        </h1>

        <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
          Track important system and user activity across your platform.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-6 text-left font-medium">Action</th>
              <th className="p-6 text-left font-medium">Resource</th>
              <th className="p-6 text-center font-medium">IP Address</th>
              <th className="p-6 text-center font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <td className="p-6 font-medium text-white">
                  {log.action}
                </td>

                <td className="p-6 text-white/70">
                  {log.resource}
                </td>

                <td className="p-6 text-center text-white/60">
                  {log.ip}
                </td>

                <td className="p-6 text-center text-white/60">
                  {log.createdAt}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-white/50"
                >
                  No audit logs available
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

      <p className="text-sm text-white/50">
        Audit logs track login activity, profile updates,
        invoice creation, and security changes.
      </p>

    </div>
  );
}
