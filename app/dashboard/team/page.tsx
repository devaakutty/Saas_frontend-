"use client";

import { useEffect, useState } from "react";

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /* ================= FETCH TEAM ================= */
  const fetchTeam = async () => {
    const res = await fetch(
      "http://localhost:5000/api/users/team",
      { credentials: "include" }
    );
    const data = await res.json();
    setUsers(data.users || data);
  };

  useEffect(() => {
    fetchTeam().finally(() => setLoading(false));
  }, []);

  /* ================= ADD USER ================= */
  const addUser = async () => {
    const res = await fetch(
      "http://localhost:5000/api/users/team",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    fetchTeam();
  };

  /* ================= REMOVE USER ================= */
  const removeUser = async (id: string) => {
    if (!confirm("Remove this user?")) return;

    await fetch(
      `http://localhost:5000/api/users/team/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    fetchTeam();
  };

  if (loading) return <p className="p-6">Loading team...</p>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Team Members</h1>

      {/* Add Member */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">
          Add Team Member
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border p-2 rounded col-span-2"
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="border p-2 rounded col-span-2"
          />
        </div>

        <button
          onClick={addUser}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add User
        </button>
      </div>

      {/* Team List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">
          Current Team
        </h2>

        {users.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {u.email} ({u.role})
              </p>
            </div>

            {u.role !== "owner" && (
              <button
                onClick={() => removeUser(u._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
