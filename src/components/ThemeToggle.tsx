"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem("lumos-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("lumos-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={theme === "dark" ? "Chuyển sang Giao diện Sáng (Light Mode)" : "Chuyển sang Giao diện Tối (Dark Mode)"}
    >
      <span>{theme === "dark" ? "☀️ SÁNG" : "🌙 TỐI"}</span>
    </button>
  );
}
