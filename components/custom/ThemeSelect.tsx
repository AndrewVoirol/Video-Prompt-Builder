"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Available themes for selection
const availableThemes = [
  { name: "MonoGeist", value: "monogeist" },
  { name: "Kodama Grove", value: "kodama-grove" },
  { name: "Cyberpunk", value: "cyber-punk" },
];

export function ThemeSelect() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [currentColorTheme, setCurrentColorTheme] = React.useState("cyber-punk");

  // Monitor for DOM readiness and theme status
  React.useEffect(() => {
    setMounted(true);

    // Extract current theme and dark mode state
    const htmlElement = document.documentElement;
    const dataTheme = htmlElement.getAttribute("data-theme") || "cyber-punk";
    const isDark = htmlElement.classList.contains("dark");

    setCurrentColorTheme(dataTheme);
    setIsDarkMode(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            setIsDarkMode(htmlElement.classList.contains("dark"));
          }
          if (mutation.attributeName === "data-theme") {
            const newTheme =
              htmlElement.getAttribute("data-theme") || "cyber-punk";
            setCurrentColorTheme(newTheme);
          }
        }
      });
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = (value: string) => {
    setCurrentColorTheme(value);
document.documentElement.setAttribute('data-theme', value);
    setTheme(value);
  };

  const toggleDarkMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    const root = document.documentElement;
    const newDarkMode = !isDarkMode;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyThemeChange = () => {
      root.classList.toggle("dark");
      setIsDarkMode(newDarkMode);
    };

    // If no view transitions support or reduced motion, apply immediately
    if (!document.startViewTransition || prefersReducedMotion) {
      applyThemeChange();
      return;
    }

    // Add transitioning class to disable CSS transitions
    root.classList.add('theme-transitioning');
    
    // Set coordinates as pixel values for the animation
    root.style.setProperty("--x", `${x}px`);
    root.style.setProperty("--y", `${y}px`);

    // Apply the view transition
    const transition = document.startViewTransition(() => {
      applyThemeChange();
    });
    
    // Remove transitioning class after animation completes
    transition.finished.then(() => {
      root.classList.remove('theme-transitioning');
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Select value={currentColorTheme} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-[160px]">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <SelectValue placeholder="Select Theme" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableThemes.map((themeOption) => (
            <SelectItem key={themeOption.value} value={themeOption.value}>
              <span className="text-sm">{themeOption.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={toggleDarkMode}
        className={cn(
          "relative inline-flex h-8 w-16 cursor-pointer items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDarkMode
            ? "bg-primary border-primary/20"
            : "bg-muted border-border",
        )}
        aria-label="Toggle dark mode"
      >
        <div
          className={cn(
            "absolute flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-lg",
            isDarkMode ? "translate-x-4" : "-translate-x-4",
          )}
        >
          <div className="relative h-3 w-3">
            <Sun
              className={cn(
                "absolute h-3 w-3",
                isDarkMode
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              )}
            />
            <Moon
              className={cn(
                "absolute h-3 w-3",
                isDarkMode
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0",
              )}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
