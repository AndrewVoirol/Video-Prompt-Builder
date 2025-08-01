"use client";

import { Moon, Sun } from "lucide-react";
import { useDualTheme } from "@/hooks/use-dual-theme";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedThemeToggleProps {
  className?: string;
}

export function EnhancedThemeToggle({ className }: EnhancedThemeToggleProps) {
  const { mode, toggleMode, mounted } = useDualTheme();

  if (!mounted) {
    return null;
  }

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleMode({ x, y });
  };

  return (
    <div className={cn("px-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SwitchPrimitives.Root
              checked={mode === "dark"}
              onClick={handleThemeToggle}
              className={cn(
                "peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                mode === "dark" ? "bg-primary" : "bg-input"
              )}
            >
              <SwitchPrimitives.Thumb
                className={cn(
                  "bg-background pointer-events-none flex size-5 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                )}
              >
                {mode === "dark" ? (
                  <Moon className="size-3" />
                ) : (
                  <Sun className="size-3" />
                )}
              </SwitchPrimitives.Thumb>
            </SwitchPrimitives.Root>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle {mode === "dark" ? "light" : "dark"} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
