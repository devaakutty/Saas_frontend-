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
  isActive: boolean;
}

type StatusFilter = "All" | "Active" | "Inactive";

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

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Customer[]>("/customers");
        setCustomers(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const ok = confirm("Are you sure you want to delete this customer?");
    if (!ok) return;

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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-400">
        Loading customers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-red-400">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    // <div className="relative px-8 pt-6 pb-12 text-white overflow-hidden">
      <div className="relative px-1 pb-12 justify-top-0 mt-0">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-[var(--font-playfair)] text-4xl font-light tracking-tight">
          Manage
          <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Customers
          </span>
        </h1>

        <button
          onClick={() => router.push("/dashboard/customers/add")}
          className="
            px-6 py-3
            rounded-xl
            font-semibold
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:scale-[1.03]
            transition-all duration-300
            shadow-lg
          "
        >
          + New Customer
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 mb-10">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone..."
          className="
            w-72
            px-4 py-3
            rounded-xl
            bg-white/10
            border border-white/20
            placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-purple-400
            text-sm
          "
        />

        {/* <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          className="
            px-4 py-3
            rounded-xl
            bg-white/10
            border border-white/20
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-purple-400
          "
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select> */}
      </div>

      {/* ================= CUSTOMER CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {filteredCustomers.map((c) => {
          const id = c.id || c._id;

          return (
            <div
              key={id}
              onClick={() =>
                router.push(`/dashboard/customers/${id}`)
              }
              className="
                cursor-pointer
                backdrop-blur-2xl
                bg-gradient-to-br from-white/10 to-white/5
                border border-white/20
                rounded-[28px]
                p-6
                shadow-xl
                hover:scale-[1.03]
                hover:border-purple-400/40
                transition-all duration-300
                space-y-4
              "
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  {c.name}
                </h3>

                {/* <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.isActive
                      ? "bg-green-500/20 text-green-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span> */}
              </div>

              <p className="text-sm text-gray-300">
                {c.email || "—"}
              </p>

              <p className="text-sm text-gray-300">
                {c.phone || "—"}
              </p>

              {/* ACTIONS */}
              <div
                className="flex gap-5 pt-3 text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() =>
                    router.push(`/dashboard/customers/${id}/edit`)
                  }
                  className="text-gray-400 hover:text-white transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>

            </div>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-24 text-gray-400">
            No customers found
          </div>
        )}

      </div>
    </div>
  );
}
