"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme?.includes('dark') || theme === 'dark'

  const handleThemeToggle = () => {
    // For basic dark/light toggle, we'll cycle between light and dark versions
    // of the current theme, defaulting to monogeist if no theme is set
    if (!theme || theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else if (theme.includes('-dark')) {
      setTheme(theme.replace('-dark', ''))
    } else {
      setTheme(`${theme}-dark`)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className={cn(
        "relative h-8 w-8 rounded-md transition-colors hover:bg-accent",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
