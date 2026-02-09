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
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-lg">Customer</h3>

      {/* SEARCH */}
      <input
        placeholder="Search by name or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      {/* LIST */}
      <div className="border rounded divide-y max-h-48 overflow-y-auto">
        {filteredCustomers.map((customer) => {
          const customerId = customer.id || customer._id;

          return (
            <button
              key={customerId}
              onClick={() => {
                setSelectedCustomer(customer);
                setName(customer.name);
                setPhone(customer.phone);
                onSelect(customer); // ✅ FIX
              }}
              className="w-full text-left px-3 py-2 hover:bg-indigo-50"
            >
              <div className="font-medium">{customer.name}</div>
              <div className="text-xs text-gray-500">
                {customer.phone}
              </div>
            </button>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="p-3 text-sm text-gray-500 text-center">
            No customer found
          </div>
        )}
      </div>

      {/* ADD / EDIT */}
      <div className="border rounded-lg p-3 space-y-2">
        <h4 className="text-sm font-semibold">
          {selectedCustomer ? "Edit Customer" : "Add New Customer"}
        </h4>

        <input
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          placeholder="Mobile number"
          value={phone}
          maxLength={10}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <button
          onClick={handleSaveCustomer}
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded py-2 text-sm disabled:opacity-50"
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
