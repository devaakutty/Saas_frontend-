"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  company?: string;
  isActive?: boolean;
  createdAt: string;
}

/* ================= PAGE ================= */

export default function CustomerViewPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH CUSTOMER ================= */

  useEffect(() => {
    apiFetch<Customer>(`/customers/${id}`)
      .then(setCustomer)
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load customer");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-24">
        Loading customer...
      </p>
    );
  }

  if (error || !customer) {
    return (
      <p className="text-center text-red-600 py-24">
        Customer not found
      </p>
    );
  }

  const isActive = customer.isActive ?? true;
  const status = isActive ? "Active" : "Inactive";
  const joined = new Date(customer.createdAt).toDateString();

  return (
    <div className="max-w-5xl space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Customers
        </button>

        <button
          onClick={() =>
            router.push(`/customers/${customer.id}/edit`)
          }
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Edit Customer
        </button>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="bg-white border rounded-xl p-6 flex items-center gap-6">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            customer.name
          )}`}
          alt={customer.name}
          className="h-20 w-20 rounded-full"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {customer.name}
          </h1>
          <p className="text-gray-500">
            {customer.country || "—"}
          </p>

          <div className="flex gap-2 mt-2">
            <StatusBadge status={status} />
            {customer.company && (
              <CompanyBadge name={customer.company} />
            )}
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Contact Information">
          <Info label="Email" value={customer.email || "—"} />
          <Info label="Phone" value={customer.phone || "—"} />
        </InfoCard>

        <InfoCard title="Account Details">
          <Info label="Customer ID" value={customer.id} />
          <Info label="Joined On" value={joined} />
        </InfoCard>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-none">
      <span className="text-sm text-gray-500">
        {label}
      </span>
      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

function CompanyBadge({ name }: { name: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
      {name}
    </span>
  );
}
