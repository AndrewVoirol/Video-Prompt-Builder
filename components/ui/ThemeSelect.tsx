"use client";

import { useTheme } from "next-themes";
import { themes } from "@/lib/themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Extract base theme (remove -dark suffix)
  const currentTheme = theme?.replace("-dark", "") || "monogeist";
  const isDark = theme?.includes("-dark") || theme === "dark";

  const handleThemeChange = (newTheme: string) => {
    const finalTheme = isDark ? `${newTheme}-dark` : newTheme;
    setTheme(finalTheme);
  };

  return (
    <Select value={currentTheme} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-[180px]" size="sm">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <SelectValue placeholder="Select theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {themes.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{
                  backgroundColor: t.preview.primary,
                }}
              />
              <span>{t.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
