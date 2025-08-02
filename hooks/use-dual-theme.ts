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
  toggleMode: (coords?: { x: number; y: number }) => void;
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

  const toggleMode = (coords?: { x: number; y: number }) => {
    const newMode = mode === "dark" ? "light" : "dark";
    
    try {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Use view transitions if supported and motion is allowed
      if (!prefersReducedMotion && "startViewTransition" in document) {
        const root = document.documentElement;
        
        // Set coordinates for transition origin if provided
        if (coords) {
          root.style.setProperty("--x", `${coords.x}px`);
          root.style.setProperty("--y", `${coords.y}px`);
        }

        // Handle experimental startViewTransition API with proper type checking
        const docWithTransition = document as Document & {
          startViewTransition?: (callback: () => void) => void;
        };
        
        try {
          docWithTransition.startViewTransition?.(() => {
            setMode(newMode);
          });
        } catch (transitionError) {
          console.warn('View transition failed, falling back to instant mode change:', transitionError);
          setMode(newMode);
        }
      } else {
        setMode(newMode);
      }
    } catch (error) {
      console.warn('Error in toggleMode, falling back to basic mode change:', error);
      setMode(newMode);
    }
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
