"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { useAuth } from "@/hooks/useAuth";

type UserRef = {
  _id: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
};

export default function UserReferencePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [users, setUsers] = useState<UserRef[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "owner") {
      router.replace("/dashboard");
      return;
    }

    loadUsers();
  }, [user, loading]);

  const loadUsers = async () => {
    try {
      const data = await apiFetch<UserRef[]>("/users");
      setUsers(data);
    } catch (err: any) {
      alert(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  if (loading || loadingUsers) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

return (
  <div className="space-y-14 text-white max-w-5xl">

    {/* HEADER */}
    <div className="flex justify-between items-start">
      <div>
        <h1 className="font-[var(--font-playfair)] text-[56px] leading-[0.95] tracking-tight">
          User{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Management
          </span>
        </h1>

        <p className="font-[var(--font-inter)] mt-4 text-white/70 text-lg">
          Manage system users and access roles.
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

    {/* TABLE */}
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="p-6 text-left font-[var(--font-inter)]">
              Email
            </th>
            <th className="p-6 text-center font-[var(--font-inter)]">
              Role
            </th>
            <th className="p-6 text-center font-[var(--font-inter)]">
              Created
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >
              <td className="p-6 text-white">
                {u.email}
              </td>

              <td className="p-6 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    u.role === "ADMIN"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {u.role}
                </span>
              </td>

              <td className="p-6 text-center text-white/50">
                {u.createdAt
                  ? new Date(u.createdAt).toDateString()
                  : "-"}
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="p-10 text-center text-white/50"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  </div>
);

}
