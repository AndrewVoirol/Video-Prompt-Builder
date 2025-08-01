import { ThemeConfig } from "./types";

export const lightTheme: ThemeConfig = {
  name: "light",
  displayName: "Light",
  description: "Clean and bright theme for optimal daytime viewing",
  colors: {
    // Base colors
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",

    // Card colors
    card: "hsl(0 0% 100%)",
    "card-foreground": "hsl(222.2 84% 4.9%)",

    // Popover colors
    popover: "hsl(0 0% 100%)",
    "popover-foreground": "hsl(222.2 84% 4.9%)",

    // Primary colors
    primary: "hsl(222.2 47.4% 11.2%)",
    "primary-foreground": "hsl(210 40% 98%)",

    // Secondary colors
    secondary: "hsl(210 40% 96%)",
    "secondary-foreground": "hsl(222.2 84% 4.9%)",

    // Muted colors
    muted: "hsl(210 40% 96%)",
    "muted-foreground": "hsl(215.4 16.3% 46.9%)",

    // Accent colors
    accent: "hsl(210 40% 96%)",
    "accent-foreground": "hsl(222.2 84% 4.9%)",

    // Destructive colors
    destructive: "hsl(0 84.2% 60.2%)",
    "destructive-foreground": "hsl(210 40% 98%)",

    // Border and input
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",

    // Ring (focus)
    ring: "hsl(222.2 84% 4.9%)",

    // Chart colors
    "chart-1": "hsl(12 76% 61%)",
    "chart-2": "hsl(173 58% 39%)",
    "chart-3": "hsl(197 37% 24%)",
    "chart-4": "hsl(43 74% 66%)",
    "chart-5": "hsl(27 87% 67%)",
  },
  radius: "0.5rem",
  fonts: {
    sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "ui-monospace", "monospace"],
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};
