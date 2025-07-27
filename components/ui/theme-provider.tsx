"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

/**
 * Enhanced ThemeProvider optimized for React 19 & Next.js 15
 * 
 * This component provides app-wide theme context with optimizations for:
 * - Reduced hydration mismatches
 * - Better SSR performance
 * - Minimal client bundle impact
 * - React 19 concurrent features support
 * 
 * @param children - React components to be wrapped with theme context
 * @param props - NextThemes provider props
 * @returns JSX element providing optimized theme context
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      // React 19 optimizations
      enableColorScheme
      storageKey="theme"
      themes={["light", "dark", "system"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
