"use client";

import * as React from "react";

const STORAGE_KEY = "theme";
const MEDIA = "(prefers-color-scheme: dark)";

export type ThemeSetting = "light" | "dark" | "system";

export type UseThemeResult = {
  theme: ThemeSetting | undefined;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSetting>>;
  resolvedTheme: "light" | "dark" | undefined;
  systemTheme: "light" | "dark" | undefined;
  themes: string[];
  forcedTheme?: string | undefined;
};

const ThemeContext = React.createContext<UseThemeResult | null>(null);

function readStoredTheme(): ThemeSetting {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return "system";
}

function systemPreference(): "light" | "dark" {
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function resolveTheme(setting: ThemeSetting): "light" | "dark" {
  return setting === "system" ? systemPreference() : setting;
}

function applyThemeClass(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function runWithoutTransitions(callback: () => void) {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(style);
  callback();
  window.getComputedStyle(document.body);
  window.setTimeout(() => {
    document.head.removeChild(style);
  }, 1);
}

export function ThemeProvider({
  children,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = React.useState<ThemeSetting | undefined>(
    undefined,
  );
  const [resolvedTheme, setResolvedTheme] = React.useState<
    "light" | "dark" | undefined
  >(undefined);
  const [systemTheme, setSystemTheme] = React.useState<
    "light" | "dark" | undefined
  >(undefined);

  React.useLayoutEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    setSystemTheme(systemPreference());
  }, []);

  React.useEffect(() => {
    if (theme === undefined) {
      return;
    }

    const persistAndApply = () => {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* ignore */
      }
      const resolved = resolveTheme(theme);
      applyThemeClass(resolved);
      setResolvedTheme(resolved);
      setSystemTheme(systemPreference());
    };

    if (disableTransitionOnChange) {
      runWithoutTransitions(persistAndApply);
    } else {
      persistAndApply();
    }
  }, [theme, disableTransitionOnChange]);

  React.useEffect(() => {
    if (theme === undefined) {
      return;
    }

    const mq = window.matchMedia(MEDIA);
    const onMediaChange = () => {
      const nextSystem = systemPreference();
      setSystemTheme(nextSystem);
      if (theme === "system") {
        const resolved = resolveTheme("system");
        applyThemeClass(resolved);
        setResolvedTheme(resolved);
      }
    };

    mq.addEventListener("change", onMediaChange);
    return () => mq.removeEventListener("change", onMediaChange);
  }, [theme]);

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return;
      }
      if (
        event.newValue !== "light" &&
        event.newValue !== "dark" &&
        event.newValue !== "system"
      ) {
        return;
      }
      setThemeState(event.newValue);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = React.useCallback(
    (value: React.SetStateAction<ThemeSetting>) => {
      setThemeState((previous) => {
        const base = previous === undefined ? readStoredTheme() : previous;
        return typeof value === "function"
          ? (value as (prev: ThemeSetting) => ThemeSetting)(base)
          : value;
      });
    },
    [],
  );

  const value = React.useMemo<UseThemeResult>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: ["light", "dark", "system"],
      forcedTheme: undefined,
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): UseThemeResult {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
