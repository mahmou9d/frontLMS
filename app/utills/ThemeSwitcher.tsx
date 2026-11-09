"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

const base =
  "grid place-items-center w-10 h-10 rounded-full border border-[#0B1020]/10 text-[#0B1020]/70 transition-colors duration-200 hover:bg-[#0B1020]/5 hover:text-[#0B1020] active:scale-95 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // Same-size placeholder until the theme is known, so the header doesn't jump
  // and server/client markup match (no hydration warning).
  if (!mounted) {
    return <span aria-hidden className="block w-10 h-10" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={base}
    >
      {isDark ? <BiSun size={20} /> : <BiMoon size={20} />}
    </button>
  );
};
