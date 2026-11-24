import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "eyercall-theme";
const TRANSITION_MS = 320;

const listeners = new Set<() => void>();
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(
  theme: Theme,
  { animate = true, persist = true }: { animate?: boolean; persist?: boolean } = {},
) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animate && !reduceMotion) {
    root.classList.add("theme-transition");
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimer = null;
    }, TRANSITION_MS + 80);
  }

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage can be blocked; the theme still applies for this session */
    }
  }

  listeners.forEach((listener) => listener());
}

export function toggleTheme() {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const serverTheme = () => "light" as Theme;

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, currentTheme, serverTheme);
}
