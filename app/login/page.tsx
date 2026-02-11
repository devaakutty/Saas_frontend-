"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/server/api";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      await login(); // refresh user state

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-sm">

        {/* 🔙 Back to Home */}
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:underline mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl space-y-4 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center">
            Login
          </h1>

          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          {/* 📝 Register Link */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:underline"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
