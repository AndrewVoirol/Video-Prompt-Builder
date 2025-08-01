"use client";

import React from "react";
import { useTheme } from "next-themes";

interface ThemeConfigContextValue {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const ThemeConfigContext = React.createContext<
  ThemeConfigContextValue | undefined
>(undefined);

export function useThemeConfig() {
  const context = React.useContext(ThemeConfigContext);
  if (!context) {
    throw new Error("useThemeConfig must be used within a ThemeConfigProvider");
  }
  return context;
}

export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  const value = React.useMemo(
    () => ({
      activeTheme: theme || "monogeist",
      setActiveTheme: setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  );
}
