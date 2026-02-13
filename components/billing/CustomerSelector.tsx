"use client";

import { useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */
export interface Customer {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
}

/* ================= COMPONENT ================= */

export default function CustomerSelector({
  customers = [],
  onSelect,
  onAddCustomer,
}: {
  customers?: Customer[];
  onSelect: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FILTER ================= */

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  /* ================= SAVE / UPDATE ================= */

  const handleSaveCustomer = async () => {
    try {
      setError("");
      setLoading(true);

      if (!name.trim()) {
        setError("Customer name is required");
        return;
      }

      if (phone.length !== 10) {
        setError("Mobile number must be 10 digits");
        return;
      }

      let customer: Customer;

      const customerId =
        selectedCustomer?.id || selectedCustomer?._id;

      if (customerId) {
        // UPDATE
        customer = await apiFetch<Customer>(
          `/customers/${customerId}`,
          {
            method: "PUT",
            body: JSON.stringify({ name, phone }),
          }
        );
      } else {
        // CREATE
        customer = await apiFetch<Customer>("/customers", {
          method: "POST",
          body: JSON.stringify({ name, phone }),
        });
      }

      onAddCustomer(customer);
      onSelect(customer); // ✅ IMPORTANT

      setSelectedCustomer(null);
      setName("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

 return (
  <div
    className="
      backdrop-blur-2xl
      bg-gradient-to-br from-white/10 to-white/5
      border border-white/20
      rounded-[28px]
      p-6
      space-y-6
      shadow-xl
      text-white
    "
  >
    <h3 className="text-lg font-semibold tracking-tight">
      Customer
    </h3>

    {/* ================= SEARCH ================= */}
    <input
      placeholder="Search by name or phone"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        w-full
        px-4 py-3
        rounded-xl
        bg-white/10
        border border-white/20
        placeholder-gray-400
        focus:outline-none
        focus:ring-2 focus:ring-purple-400
        transition
      "
    />

    {/* ================= CUSTOMER LIST ================= */}
    <div
      className="
        rounded-2xl
        border border-white/10
        divide-y divide-white/10
        max-h-48 overflow-y-auto
        bg-white/5
      "
    >
      {filteredCustomers.map((customer) => {
        const customerId = customer.id || customer._id;

        return (
          <button
            key={customerId}
            onClick={() => {
              setSelectedCustomer(customer);
              setName(customer.name);
              setPhone(customer.phone);
              onSelect(customer);
            }}
            className="
              w-full text-left
              px-4 py-3
              hover:bg-white/10
              transition-all
            "
          >
            <div className="font-medium">
              {customer.name}
            </div>
            <div className="text-xs text-gray-400">
              {customer.phone}
            </div>
          </button>
        );
      })}

      {filteredCustomers.length === 0 && (
        <div className="p-4 text-sm text-gray-400 text-center">
          No customer found
        </div>
      )}
    </div>

    {/* ================= ADD / EDIT ================= */}
    <div
      className="
        rounded-2xl
        border border-white/10
        p-5
        space-y-4
        bg-white/5
      "
    >
      <h4 className="text-sm font-semibold tracking-wide text-purple-300">
        {selectedCustomer
          ? "Edit Customer"
          : "Add New Customer"}
      </h4>

      <input
        placeholder="Customer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="
          w-full
          px-4 py-2.5
          rounded-xl
          bg-white/10
          border border-white/20
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-purple-400
        "
      />

      <input
        placeholder="Mobile number"
        value={phone}
        maxLength={10}
        onChange={(e) =>
          setPhone(e.target.value.replace(/\D/g, ""))
        }
        className="
          w-full
          px-4 py-2.5
          rounded-xl
          bg-white/10
          border border-white/20
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-purple-400
        "
      />

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleSaveCustomer}
        disabled={loading}
        className="
          w-full
          py-3
          rounded-xl
          font-semibold
          bg-gradient-to-r from-purple-500 to-pink-500
          hover:scale-[1.02]
          transition-all duration-300
          shadow-lg
          disabled:opacity-50
        "
      >
        {loading
          ? "Saving..."
          : selectedCustomer
          ? "Update Customer"
          : "Add Customer"}
      </button>
    </div>
  </div>
);

}
