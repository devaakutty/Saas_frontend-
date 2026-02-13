"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

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
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[#1b1f3a] to-[#2b2e63]">

      {/* Glow Background */}
      <div className="absolute top-[-200px] left-[-150px] w-[450px] h-[450px] bg-purple-600 opacity-20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[450px] h-[450px] bg-pink-600 opacity-20 blur-[150px] rounded-full" />

      {/* 🔥 Premium Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 px-5 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-md"
      >
        ← Home
      </Link>

      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-[24px] shadow-2xl p-10 text-white">

        {/* Hero Heading */}
        <h1 className="font-[var(--font-playfair)] text-5xl md:text-6xl font-light text-center leading-tight tracking-tight mb-6">
          Welcome Back
          <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sign In
          </span>
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Access your dashboard and manage your billing
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-300 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
