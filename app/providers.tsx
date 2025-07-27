"use client"

import { ThemeProvider } from "next-themes"
import { ThemeConfigProvider } from "@/components/active-theme"
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="cyberpunk"
      themes={['monogeist', 'kodama-grove', 'cyberpunk']}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ThemeConfigProvider>
        {children}
        <Toaster />
      </ThemeConfigProvider>
    </ThemeProvider>
  )
}
