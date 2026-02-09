"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

interface Customer {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  userId: string;
}

type StatusFilter = "All" | "Active" | "Inactive";

/* ================= STATUS BADGE ================= */

function StatusBadge({ isActive }: { isActive?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

/* ================= PAGE ================= */

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Customer[]>("/customers");
      setCustomers(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ================= DELETE ================= */

    const handleDelete = async (id?: string) => {
      if (!id) {
        console.error("Delete failed: customer id is undefined");
        return;
      }

      if (!confirm("Are you sure you want to delete this customer?")) return;

      try {
        await apiFetch(`/customers/${id}`, { method: "DELETE" });

        setCustomers((prev) =>
          prev.filter((c) => (c.id || c._id) !== id)
        );
      } catch (err: any) {
        alert(err.message || "Delete failed");
      }
    };


  /* ================= FILTER ================= */

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();

    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q);

    const status = c.isActive ? "Active" : "Inactive";

    return (
      matchesSearch &&
      (statusFilter === "All" || status === statusFilter)
    );
  });

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-500">
        Loading customers…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Customers
          <span className="ml-2 text-sm font-medium text-gray-500">
            ({customers.length})
          </span>
        </h1>

        <button
          onClick={() => router.push("/customers/add")}
          className="
            px-6 py-2.5
            bg-black text-white
            rounded-full
            text-sm font-medium
            hover:opacity-90
            transition
          "
        >
          + New Customer
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone…"
          className="
            w-72
            px-4 py-2.5
            rounded-full
            border border-gray-300
            bg-white
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-black
          "
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          className="
            px-4 py-2.5
            rounded-full
            border border-gray-300
            bg-white
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-black
          "
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* ================= CUSTOMER CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCustomers.map((c) => (
          <div
            key={c.id || c._id}
            className="
              bg-white
              rounded-[18px]
              p-5
              shadow-[0_10px_30px_rgba(0,0,0,0.05)]
              space-y-3
            "
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-black">
                {c.name}
              </h3>
              <StatusBadge isActive={c.isActive} />
            </div>

            <p className="text-sm text-gray-600">
              {c.email || "—"}
            </p>

            <p className="text-sm text-gray-600">
              {c.phone || "—"}
            </p>

            <div className="flex gap-5 pt-4 text-sm">
              <button
                onClick={() =>
                  router.push(`/customers/${c.id}`)
                }
                className="text-black hover:underline"
              >
                View
              </button>

              <button
                onClick={() =>
                 router.push(`/customers/${c.id || c._id}`)
                }
                className="text-gray-500 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c.id || c._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-24 text-gray-500">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
}
