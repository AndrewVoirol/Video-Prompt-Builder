import React from "react";

/**
 * Badge Component Props Interface
 *
 * Defines the strictly typed props for the Badge component,
 * ensuring type safety and consistent API usage.
 */
export interface BadgeProps {
  /** The text content to display inside the badge */
  label: string;

  /** The color variant of the badge, affecting background and text colors */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral";

  /** Additional CSS classes to apply to the badge for custom styling */
  className?: string;
}

/**
 * Badge - Atomic UI Component
 *
 * A strictly typed, exportable React functional component that serves as an atomic
 * label/status primitive within the design system. The Badge component provides
 * a consistent way to display small pieces of information such as status indicators,
 * labels, counts, or categories throughout the application.
 *
 * **Design System Usage:**
 * - Use for status indicators (active, inactive, pending)
 * - Display notification counts or numerical badges
 * - Show categorical labels or tags
 * - Indicate completion states or progress markers
 * - Provide visual emphasis for important information
 *
 * **Accessibility Features:**
 * - Semantic HTML structure for screen readers
 * - Proper color contrast ratios for all color variants
 * - Text content is always readable and descriptive
 *
 * **Styling Notes:**
 * - Follows design system color palette and typography scales
 * - Responsive design ensures consistent appearance across devices
 * - Supports customization through className prop while maintaining design consistency
 *
 * @param props - The component props conforming to BadgeProps interface
 * @param props.label - Required text content to display
 * @param props.color - Optional color variant (defaults to 'neutral')
 * @param props.className - Optional additional CSS classes
 *
 * @returns A rendered Badge component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Badge label="New" />
 *
 * // With color variant
 * <Badge label="Active" color="success" />
 *
 * // With custom styling
 * <Badge label="Premium" color="primary" className="font-bold" />
 *
 * // Status indicator
 * <Badge label="3" color="error" className="notification-badge" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  color = "neutral",
  className = "",
}) => {
  // Base CSS classes for consistent styling
  const baseClasses =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

  // Color variant classes mapped to design system colors
  const colorClasses = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    neutral:
      "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
  };

  // Combine all classes for the final className
  const finalClassName =
    `${baseClasses} ${colorClasses[color]} ${className}`.trim();

  return (
    <span
      className={finalClassName}
      role="status"
      aria-label={`Badge: ${label}`}
    >
      {label}
    </span>
  );
};

// Default export for convenience
export default Badge;
