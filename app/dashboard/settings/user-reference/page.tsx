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

    if (user.role !== "ADMIN") {
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
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          User Reference
        </h1>

        <button
          onClick={() => router.push("/settings/create-user")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + Create User
        </button>
      </div>

      <div className="bg-[#0e1117] border border-white/20 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-white/10">
                <td className="p-4 text-white">{u.email}</td>
                <td className="p-4 text-center">{u.role}</td>
                <td className="p-4 text-center text-gray-500">
                  {u.createdAt
                    ? new Date(u.createdAt).toDateString()
                    : "-"}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
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
