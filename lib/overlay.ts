import { cn } from "@/lib/utils";

/**
 * Shared overlay styles for consistent appearance across all overlay components.
 * Ensures uniform background, border, elevation, and typography across themes.
 *
 * This module provides centralized styling for all overlay components including:
 * - Popover, Tooltip, Dialog, HoverCard
 * - Combobox lists, Select dropdowns
 * - Menu and submenu content
 * - Command palettes and sheets
 *
 * All overlay styles automatically adapt to the current theme (MonoGeist, Kodama Grove, or Cyberpunk)
 * by using CSS custom properties defined in globals.css.
 *
 * @example Basic usage
 * ```tsx
 * import { overlayStyles } from "@/lib/overlay";
 *
 * // Use predefined variants
 * const popoverClasses = overlayStyles.popover("w-64 p-3");
 * const tooltipClasses = overlayStyles.tooltip();
 * const dialogClasses = overlayStyles.dialog();
 * ```
 *
 * @example Custom overlay styling
 * ```tsx
 * import { getOverlayStyles } from "@/lib/overlay";
 *
 * // Custom overlay with specific variant
 * const customOverlay = getOverlayStyles("default", "max-w-sm border-2");
 * ```
 */

// Base overlay styles common to all overlay components
const baseOverlayStyles = [
  // Background and foreground using surface tokens
  "bg-[var(--surface-popover)]",
  "text-popover-foreground",

  // Border and radius
  "border",
  "rounded-md",

  // Shadow for elevation
  "shadow-md",

  // Z-index for proper layering
  "z-50",

  // Backdrop blur removal for consistent appearance
  "backdrop-blur-none",

  // Animation support
  "data-[state=open]:animate-in",
  "data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0",
  "data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95",
  "data-[state=open]:zoom-in-95",

  // Slide animations based on side
  "data-[side=bottom]:slide-in-from-top-2",
  "data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2",
  "data-[side=top]:slide-in-from-bottom-2",
];

// Specific overlay variants for different component types
export const overlayVariants = {
  // Default overlay style (Popover, Select, etc.)
  default: [
    ...baseOverlayStyles,
    "min-w-[8rem]",
    "origin-(--radix-popover-content-transform-origin)",
  ],

  // Tooltip-specific styles
  tooltip: [
    "bg-primary",
    "text-primary-foreground",
    "animate-in",
    "fade-in-0",
    "zoom-in-95",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=closed]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    "z-50",
    "w-fit",
    "origin-(--radix-tooltip-content-transform-origin)",
    "rounded-md",
    "px-3",
    "py-1.5",
    "text-xs",
    "text-balance",
  ],

  // Dialog-specific styles (elevated surface)
  dialog: [
    "bg-[var(--surface-elevated)]",
    "text-foreground",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95",
    "data-[state=open]:zoom-in-95",
    "fixed",
    "top-[50%]",
    "left-[50%]",
    "z-50",
    "grid",
    "w-full",
    "max-w-[calc(100%-2rem)]",
    "translate-x-[-50%]",
    "translate-y-[-50%]",
    "gap-4",
    "rounded-lg",
    "border",
    "p-6",
    "shadow-lg",
    "duration-200",
    "sm:max-w-lg",
  ],

  // Sheet-specific styles (elevated surface)
  sheet: [
    "bg-[var(--surface-elevated)]",
    "text-foreground",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "fixed",
    "z-50",
    "flex",
    "flex-col",
    "gap-4",
    "shadow-lg",
    "transition",
    "ease-in-out",
    "data-[state=closed]:duration-300",
    "data-[state=open]:duration-500",
  ],

  // Command menu/combobox list styles
  command: [
    ...baseOverlayStyles,
    "flex",
    "h-full",
    "w-full",
    "flex-col",
    "overflow-hidden",
  ],

  // Menubar content styles
  menu: [
    ...baseOverlayStyles,
    "min-w-[12rem]",
    "origin-(--radix-menubar-content-transform-origin)",
    "overflow-hidden",
    "p-1",
  ],

  // Submenu styles
  submenu: [
    ...baseOverlayStyles,
    "min-w-[8rem]",
    "origin-(--radix-menubar-content-transform-origin)",
    "overflow-hidden",
    "p-1",
    "shadow-lg",
  ],
} as const;

type OverlayVariant = keyof typeof overlayVariants;

/**
 * Get overlay styles for a specific variant with optional custom styles.
 *
 * @param variant - The overlay variant type
 * @param customStyles - Additional custom CSS classes to apply
 * @returns Combined CSS classes for the overlay
 *
 * @example
 * ```tsx
 * import { getOverlayStyles } from "@/lib/overlay";
 *
 * // For a popover
 * const popoverClasses = getOverlayStyles("default", "w-72 p-4");
 *
 * // For a tooltip
 * const tooltipClasses = getOverlayStyles("tooltip");
 *
 * // For a dialog
 * const dialogClasses = getOverlayStyles("dialog");
 * ```
 */
export function getOverlayStyles(
  variant: OverlayVariant = "default",
  customStyles?: string,
) {
  return cn(overlayVariants[variant], customStyles);
}

// Pre-defined style combinations for common use cases
export const overlayStyles = {
  // Popover styles
  popover: (customStyles?: string) => getOverlayStyles("default", customStyles),

  // Tooltip styles
  tooltip: (customStyles?: string) => getOverlayStyles("tooltip", customStyles),

  // Dialog styles
  dialog: (customStyles?: string) => getOverlayStyles("dialog", customStyles),

  // Sheet styles
  sheet: (customStyles?: string) => getOverlayStyles("sheet", customStyles),

  // Command/Combobox styles
  command: (customStyles?: string) => getOverlayStyles("command", customStyles),

  // Menu styles
  menu: (customStyles?: string) => getOverlayStyles("menu", customStyles),

  // Submenu styles
  submenu: (customStyles?: string) => getOverlayStyles("submenu", customStyles),
} as const;

/**
 * Legacy function for backward compatibility.
 * @deprecated Use getOverlayStyles or overlayStyles object instead
 */
export function overlayStylesLegacy(_theme: string, customStyles?: string) {
  return getOverlayStyles("default", customStyles);
}
