"use client";

import { useEffect } from "react";

export default function ThemeLoader() {
  useEffect(() => {
    const savedAccent = localStorage.getItem("accent");

    document.documentElement.classList.remove(
      "theme-pink",
      "theme-blue",
      "theme-green"
    );

    if (savedAccent && savedAccent !== "default") {
      document.documentElement.classList.add(
        `theme-${savedAccent}`
      );
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}
