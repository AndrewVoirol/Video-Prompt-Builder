/**
 * Theme registry/aggregator for palettes and design tokens.
 * Used for theme switching, config lookup, and theme summary in the theme provider.
 */
import { lightTheme } from "./light";
import { darkTheme } from "./dark";
import type { ThemeConfig } from "./types";

export const themeRegistry: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

export { lightTheme, darkTheme };
