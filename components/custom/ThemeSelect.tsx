"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Palette, Sun, Moon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { themes } from "@/lib/themes"

export function ThemeSelect() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Extract color theme from combined theme (e.g., "cyberpunk-dark" -> "cyberpunk")
  const getColorTheme = (themeValue: string | undefined) => {
    if (!themeValue || themeValue === "system") return "tweakcn"
    return themeValue.replace("-dark", "").replace("-light", "")
  }

  // Check if current theme is dark mode
  const isDarkMode = Boolean(resolvedTheme === "dark" || (theme && theme.endsWith("-dark")))

  // Get current color theme without dark/light suffix
  const currentColorTheme = getColorTheme(theme)

  const handleColorThemeChange = (newColorTheme: string) => {
    if (newColorTheme === "system") {
      setTheme("system")
    } else {
      const newTheme = isDarkMode ? `${newColorTheme}-dark` : newColorTheme
      setTheme(newTheme)
    }
  }

  const handleDarkModeToggle = (checked: boolean) => {
    if (currentColorTheme === "system" || theme === "system") {
      // If system theme, just toggle between light and dark
      setTheme(checked ? "dark" : "light")
    } else {
      // Apply dark/light suffix to current color theme
      const newTheme = checked ? `${currentColorTheme}-dark` : currentColorTheme
      setTheme(newTheme)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={currentColorTheme} onValueChange={handleColorThemeChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <SelectValue placeholder="Select theme" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => (
            <SelectItem key={themeOption.value} value={themeOption.value}>
              <div className="flex items-center gap-3">
                {themeOption.value === "system" ? (
                  <Monitor className="h-4 w-4" />
                ) : (
                  <div className="flex gap-1">
                    <div
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: themeOption.preview.primary }}
                    />
                    <div
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: themeOption.preview.secondary }}
                    />
                    <div
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: themeOption.preview.accent }}
                    />
                  </div>
                )}
                <span>{themeOption.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <Switch
          checked={isDarkMode}
          onCheckedChange={handleDarkModeToggle}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4" />
      </div>
    </div>
  )
}
