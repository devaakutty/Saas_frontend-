"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/account/usage",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setUsage(data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Plan Card */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">
          Current Plan
        </h2>

        <p className="capitalize text-indigo-600 font-bold">
          {usage.plan}
        </p>

        <p className="mt-2 text-gray-600">
          Users: {usage.usersUsed} / {usage.userLimit}
        </p>

        {usage.usersRemaining === 0 && (
          <a
            href="/pricing"
            className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Upgrade Plan
          </a>
        )}
      </div>
    </div>
  );
}
