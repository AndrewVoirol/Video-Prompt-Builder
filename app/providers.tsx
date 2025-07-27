"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { getAllThemeVariants } from "@/lib/themes"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      themes={getAllThemeVariants()}
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </NextThemesProvider>
  )
}
