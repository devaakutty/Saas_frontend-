"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type Accent = "default" | "pink" | "blue" | "green";

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [accent, setAccent] = useState<Accent>("default");

  /* ================= LOAD SAVED SETTINGS ================= */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccent = localStorage.getItem("accent") as Accent | null;

    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccent(savedAccent);
  }, []);

  /* ================= APPLY DARK / LIGHT ================= */
  useEffect(() => {
    const root = document.documentElement;

    const applySystemTheme = () => {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    };

    if (theme === "system") {
      localStorage.removeItem("theme");
      applySystemTheme();

      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", applySystemTheme);
      return () => media.removeEventListener("change", applySystemTheme);
    }

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= APPLY ACCENT ================= */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(
      "theme-pink",
      "theme-blue",
      "theme-green"
    );

    if (accent !== "default") {
      root.classList.add(`theme-${accent}`);
    }

    localStorage.setItem("accent", accent);
  }, [accent]);

  /* ================= UI ================= */

  return (
    <div className="space-y-14 max-w-5xl">
      
      {/* HEADER */}
      <div>
        <h1 className="font-playfair text-5xl leading-tight">
          Appearance{" "}
          <span className="font-bold text-primary">
            Settings
          </span>
        </h1>

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Customize theme and accent colors across your dashboard.
        </p>
      </div>

      {/* THEME SECTION */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-10 space-y-8">
        
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Theme Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemeCard
              title="Dark"
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            />

            <ThemeCard
              title="Light"
              active={theme === "light"}
              onClick={() => setTheme("light")}
            />

            <ThemeCard
              title="System"
              active={theme === "system"}
              onClick={() => setTheme("system")}
            />
          </div>
        </div>

        {/* ACCENT SECTION */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Accent Color
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AccentCard
              title="Purple"
              active={accent === "default"}
              onClick={() => setAccent("default")}
            />

            <AccentCard
              title="Pink"
              active={accent === "pink"}
              onClick={() => setAccent("pink")}
            />

            <AccentCard
              title="Blue"
              active={accent === "blue"}
              onClick={() => setAccent("blue")}
            />

            <AccentCard
              title="Green"
              active={accent === "green"}
              onClick={() => setAccent("green")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= THEME CARD ================= */

function ThemeCard({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border transition ${
        active
          ? "border-primary bg-primary/10"
          : "border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
      }`}
    >
      <p className="font-medium">{title}</p>
      {active && (
        <span className="text-xs text-primary mt-2 inline-block">
          Active
        </span>
      )}
    </button>
  );
}

/* ================= ACCENT CARD ================= */

function AccentCard({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border transition ${
        active
          ? "border-primary bg-primary/10"
          : "border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
      }`}
    >
      <p className="font-medium">{title}</p>
    </button>
  );
}
