import { cn } from "@/lib/utils";

interface StaticBadgeProps {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string | undefined;
}

/**
 * Server Component Badge - Optimized for React 19 & Next.js 15
 *
 * This is a server component that renders badges without client-side JavaScript,
 * reducing the client bundle size. Use this for static badges that don't require
 * interactivity.
 *
 * For interactive badges (with click handlers, etc.), use the client component version.
 */
export function StaticBadge({
  variant = "default",
  size = "md",
  children,
  className,
}: StaticBadgeProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-medium";

  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-background hover:bg-accent hover:text-accent-foreground",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  );
}

/**
 * Server Component for Provenance Badge - shows data source information
 */
interface ProvenanceBadgeProps {
  source: string;
  origin?: string;
  modified?: boolean;
  className?: string;
}

export function ProvenanceBadge({
  source,
  origin,
  modified,
  className,
}: ProvenanceBadgeProps) {
  const getVariant = (source: string): StaticBadgeProps["variant"] => {
    switch (source.toLowerCase()) {
      case "preset":
        return "secondary";
      case "user":
        return modified ? "warning" : "default";
      case "system":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <StaticBadge
      variant={getVariant(source) || "default"}
      size="sm"
      className={className}
    >
      {source}
      {origin && ` (${origin})`}
      {modified && " (modified)"}
    </StaticBadge>
  );
}

export default StaticBadge;
