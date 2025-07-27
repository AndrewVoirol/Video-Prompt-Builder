"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { themes } from "@/lib/themes";

type Theme = "light" | "dark" | "system";
type ColorScheme = typeof themes[number]["value"];

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: (event?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "monogeist",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(defaultColorScheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorScheme = localStorage.getItem("color-scheme") as ColorScheme;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setThemeState(systemTheme);
    }
    
    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");
    
    // Apply color scheme
    root.setAttribute("data-theme", colorScheme);
    
    // Apply light/dark theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Store in localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("color-scheme", colorScheme);
  }, [theme, colorScheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
  };

  const toggleTheme = (event?: { x: number; y: number }) => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Apply view transition if supported and coordinates provided
    if (event && "startViewTransition" in document) {
      const { x, y } = event;
      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);
      
      // @ts-ignore - startViewTransition is experimental
      document.startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      setTheme(newTheme);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        setTheme,
        setColorScheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
