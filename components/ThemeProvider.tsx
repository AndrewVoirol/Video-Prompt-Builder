"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider component serves as the app-wide theme context endpoint.
 * 
 * This component wraps the application with next-themes provider functionality,
 * enabling theme switching capabilities throughout the app. It integrates with
 * TweakCN/ShadCN theme system to provide consistent theming across all components.
 * 
 * Features:
 * - Provides theme context to all child components
 * - Supports light/dark theme switching
 * - Integrates with TweakCN/ShadCN theming system
 * - Enables system theme detection and automatic switching
 * - Prevents hydration mismatches during SSR
 * 
 * Usage:
 * Wrap your app root or layout with this provider to enable theming:
 * 
 * ```tsx
 * <ThemeProvider>
 *   <YourAppContent />
 * </ThemeProvider>
 * ```
 * 
 * @param children - React components to be wrapped with theme context
 * @returns JSX element providing theme context to children
 */

interface ThemeProviderProps {
  /** Child components that will receive theme context */
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export { ThemeProvider };
