/**
 * Core type definitions for the theme system
 * Provides strict typing for ShadCN/tweakcn compatible themes
 */

export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;

  // Card colors
  card: string;
  "card-foreground": string;

  // Popover colors
  popover: string;
  "popover-foreground": string;

  // Primary colors
  primary: string;
  "primary-foreground": string;

  // Secondary colors
  secondary: string;
  "secondary-foreground": string;

  // Muted colors
  muted: string;
  "muted-foreground": string;

  // Accent colors
  accent: string;
  "accent-foreground": string;

  // Destructive colors
  destructive: string;
  "destructive-foreground": string;

  // Border and input
  border: string;
  input: string;

  // Ring (focus)
  ring: string;

  // Surface colors
  "surface-code": string;

  // Chart colors
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
}

export interface ThemeFonts {
  sans: string[];
  mono: string[];
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  radius: string;
  fonts: ThemeFonts;
  shadows: ThemeShadows;
}

export interface ThemeToken {
  name: string;
  value: string;
  type: "color" | "spacing" | "typography" | "shadow" | "border-radius";
  category: string;
}

export interface ThemeRegistry {
  themes: Record<string, ThemeConfig>;
  defaultTheme: string;
  activeTheme: string;
}

// CSS custom property names for theme variables
export type CSSVarName = `--${string}`;

// Theme mode types
export type ThemeMode = "light" | "dark" | "auto";

// Color palette types for atomic design
export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export interface ColorPalette {
  gray: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  destructive: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}

export interface AtomicTheme {
  palette: ColorPalette;
  semantic: ThemeColors;
  radius: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, unknown>;
  shadows: ThemeShadows;
}
