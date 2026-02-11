"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState<Theme>("system");

  /* ================= LOAD SAVED THEME ================= */
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme("system");
    }
  }, []);

  /* ================= APPLY THEME ================= */
  useEffect(() => {
    const root = document.documentElement;

    const applySystemTheme = () => {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      localStorage.removeItem("theme");
      applySystemTheme();

      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", applySystemTheme);

      return () => {
        media.removeEventListener("change", applySystemTheme);
      };
    }

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-8 rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Appearance</h1>

      <div className="bg-[#11141c] border border-white/10 rounded-xl p-6 max-w-3xl space-y-6">
        <p className="text-sm text-gray-400">
          Customize how QuickBillz looks on your device.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ThemeCard
            title="Dark"
            description="Best for low light environments"
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
          />

          <ThemeCard
            title="Light"
            description="Bright and clean appearance"
            active={theme === "light"}
            onClick={() => setTheme("light")}
          />

          <ThemeCard
            title="System"
            description="Follow your system preference"
            active={theme === "system"}
            onClick={() => setTheme("system")}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= THEME CARD ================= */

function ThemeCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border transition ${
        active
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-white/10 hover:bg-white/5"
      }`}
    >
      <p className="font-medium mb-1">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>

      {active && (
        <span className="inline-block mt-3 text-xs text-indigo-400">
          Active
        </span>
      )}
    </button>
  );
}
