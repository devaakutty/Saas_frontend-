"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

interface Customer {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await apiFetch<Customer>(`/customers/${id}`);
        setCustomer(data);
      } catch (err: any) {
        setError(err.message || "Customer not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center text-gray-400">
        Loading customer...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-red-400">
        <p>{error}</p>
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="mt-4 px-6 py-2 bg-purple-600 rounded-xl text-white"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">

      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl space-y-8">

        <h1 className="text-2xl font-semibold text-center text-white">
          Customer Details
        </h1>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-2 gap-6 text-gray-300">

          <div>
            <p className="text-sm text-white/50 mb-1">Full Name</p>
            <p className="text-lg font-medium text-white">
              {customer.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50 mb-1">Email</p>
            <p className="text-lg font-medium text-white">
              {customer.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50 mb-1">Mobile</p>
            <p className="text-lg font-medium text-white">
              {customer.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50 mb-1">Status</p>
            {/* <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                customer.isActive
                  ? "bg-green-500/20 text-green-300"
                  : "bg-gray-500/20 text-gray-300"
              }`}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </span> */}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6 border-t border-white/20">

          <button
            onClick={() => router.push("/dashboard/customers")}
            className="px-6 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
          >
            Back
          </button>

          <button
            onClick={() =>
              router.push(`/dashboard/customers/${id}/edit`)
            }
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Edit
          </button>

        </div>

      </div>
    </div>
  );
}
