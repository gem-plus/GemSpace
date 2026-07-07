import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const BRAND_COLORS = {
  purple: {
    name: "Purple",
    light: { h: 285, c: 0.22, l: 0.50 },
    dark: { h: 285, c: 0.20, l: 0.65 },
  },
  indigo: {
    name: "Indigo",
    light: { h: 260, c: 0.22, l: 0.48 },
    dark: { h: 260, c: 0.18, l: 0.62 },
  },
  blue: {
    name: "Blue",
    light: { h: 235, c: 0.20, l: 0.50 },
    dark: { h: 235, c: 0.18, l: 0.65 },
  },
  teal: {
    name: "Teal",
    light: { h: 175, c: 0.18, l: 0.45 },
    dark: { h: 175, c: 0.15, l: 0.60 },
  },
  rose: {
    name: "Rose",
    light: { h: 350, c: 0.20, l: 0.55 },
    dark: { h: 350, c: 0.18, l: 0.70 },
  },
  amber: {
    name: "Amber",
    light: { h: 45, c: 0.18, l: 0.55 },
    dark: { h: 45, c: 0.15, l: 0.70 },
  },
};

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyCSSVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function applyBrandColor(colorKey, isDark) {
  const colorConfig = BRAND_COLORS[colorKey];
  if (!colorConfig) return;

  const color = isDark ? colorConfig.dark : colorConfig.light;
  const primaryValue = `oklch(${color.l} ${color.c} ${color.h})`;

  const primaryForegroundLight = color.l > 0.6 ? 0.15 : 0.98;
  const primaryForegroundValue = `oklch(${primaryForegroundLight} 0 0)`;

  applyCSSVariable("--primary", primaryValue);
  applyCSSVariable("--primary-foreground", primaryForegroundValue);

  const ringValue = `oklch(${color.l} ${color.c * 0.6} ${color.h})`;
  applyCSSVariable("--ring", ringValue);

  const sidebarPrimary = `oklch(${color.l} ${color.c} ${color.h})`;
  applyCSSVariable("--sidebar-primary", sidebarPrimary);

  const accentValue = `oklch(${isDark ? 0.269 : 0.97} ${isDark ? color.c * 0.3 : 0} ${isDark ? color.h : 0})`;
  applyCSSVariable("--accent", accentValue);

  document.documentElement.style.setProperty("--brand-hue", color.h);
  document.documentElement.style.setProperty("--brand-chroma", color.c);
  document.documentElement.style.setProperty("--brand-light", color.l);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("gemspace-theme");
    return stored || "system";
  });

  const [brandColor, setBrandColor] = useState(() => {
    if (typeof window === "undefined") return "purple";
    const stored = localStorage.getItem("gemspace-brand");
    return stored || "purple";
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const updateResolvedTheme = () => {
      const newResolved =
        theme === "system" ? getSystemTheme() : theme;
      setResolvedTheme(newResolved);

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newResolved);
    };

    updateResolvedTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateResolvedTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    applyBrandColor(brandColor, resolvedTheme === "dark");
    localStorage.setItem("gemspace-brand", brandColor);
  }, [brandColor, resolvedTheme]);

  useEffect(() => {
    localStorage.setItem("gemspace-theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    brandColor,
    setBrandColor,
    brandColors: BRAND_COLORS,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { BRAND_COLORS };
