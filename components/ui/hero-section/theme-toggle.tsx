"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
       <button
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors opacity-50"
        disabled
      >
        <Sun className="w-4 h-4" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative w-8 h-8 flex items-center justify-center"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute text-neutral-800 dark:text-neutral-200" />
      <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute text-neutral-800 dark:text-neutral-200" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
