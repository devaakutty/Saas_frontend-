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
      setLoading(false); // ✅ FIX
      return;
    }

    loadLogs();
  }, [isAuthenticated]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ TEMP DEMO DATA
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
      <div className="p-6 text-gray-400">
        Loading audit logs…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-gray-400">
        Please log in to view audit logs.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <span className="text-sm text-gray-400">Last 30 days</span>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Resource</th>
              <th className="p-4 text-center">IP Address</th>
              <th className="p-4 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{log.action}</td>
                <td className="p-4 text-gray-700">{log.resource}</td>
                <td className="p-4 text-center text-gray-500">{log.ip}</td>
                <td className="p-4 text-center text-gray-500">
                  {log.createdAt}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-400"
                >
                  No audit logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Audit logs track important actions like login, profile updates,
        invoices, and security changes.
      </p>
    </div>
  );
}
