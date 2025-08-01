"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

export type ColorScheme = "monogeist" | "kodama-grove" | "cyber-punk";
export type Mode = "light" | "dark";

interface DualThemeReturn {
  colorScheme: ColorScheme;
  mode: Mode;
  setColorScheme: (scheme: ColorScheme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  mounted: boolean;
}

export function useDualTheme(): DualThemeReturn {
  const { theme, setTheme } = useNextTheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("cyber-punk");
  const [mode, setModeState] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load saved preferences
    const savedColorScheme = localStorage.getItem(
      "color-scheme",
    ) as ColorScheme;
    const savedMode = localStorage.getItem("mode") as Mode;

    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
      document.documentElement.setAttribute("data-theme", savedColorScheme);
    } else {
      const currentTheme = document.documentElement.getAttribute(
        "data-theme",
      ) as ColorScheme;
      if (currentTheme) {
        setColorSchemeState(currentTheme);
      }
    }

    if (savedMode) {
      setModeState(savedMode);
      setTheme(savedMode);
    } else if (theme === "dark" || theme === "light") {
      setModeState(theme as Mode);
    }
  }, [theme, setTheme]);

  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
    document.documentElement.setAttribute("data-theme", newScheme);
    localStorage.setItem("color-scheme", newScheme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
document.documentElement.classList.toggle('dark', newMode === 'dark');
    setTheme(newMode);
    localStorage.setItem("mode", newMode);
  };

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
  };

  return {
    colorScheme,
    mode,
    setColorScheme,
    setMode,
    toggleMode,
    mounted,
  };
}
