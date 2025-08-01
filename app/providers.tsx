"use client";

import { ThemeProvider } from "next-themes";
import { ThemeConfigProvider } from "@/components/active-theme";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

// Custom provider to handle dual theming (color scheme + dark mode)
function DualThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure data-theme attribute is set on mount
    const root = document.documentElement;
    if (!root.getAttribute("data-theme")) {
      root.setAttribute("data-theme", "cyberpunk");
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <DualThemeProvider>
        <ThemeConfigProvider>
          {children}
          <Toaster />
        </ThemeConfigProvider>
      </DualThemeProvider>
    </ThemeProvider>
  );
}
