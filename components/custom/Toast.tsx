import React from "react";

/**
 * Atomic global ephemeral notification system component.
 *
 * The Toast component provides a standardized way to display temporary notification
 * messages to users. It serves as the foundation for all ephemeral notifications
 * across the application, ensuring consistent styling and behavior for success,
 * error, warning, and informational messages.
 *
 * @component
 * @example
 * ```tsx
 * <Toast
 *   message="Operation completed successfully!"
 *   type="success"
 *   onClose={() => setShowToast(false)}
 * />
 * ```
 */

/** Toast notification types */
export type ToastType = "success" | "error" | "warning" | "info";

/** Props for the Toast component */
export interface ToastProps {
  /** The message content to display in the toast notification */
  message: string;
  /** The type of toast notification which determines styling and semantics */
  type: ToastType;
  /** Callback function triggered when the toast should be dismissed */
  onClose: () => void;
}

/**
 * Toast notification component for displaying ephemeral messages.
 *
 * @param props - The component props
 * @returns The rendered Toast component
 */
export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const getToastStyles = (): string => {
    const baseStyles =
      "fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 flex items-center justify-between";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-100 border border-green-400 text-green-700`;
      case "error":
        return `${baseStyles} bg-red-100 border border-red-400 text-red-700`;
      case "warning":
        return `${baseStyles} bg-yellow-100 border border-yellow-400 text-yellow-700`;
      case "info":
        return `${baseStyles} bg-blue-100 border border-blue-400 text-blue-700`;
      default:
        return `${baseStyles} bg-gray-100 border border-gray-400 text-gray-700`;
    }
  };

  const getAriaLabel = (): string => {
    return `${type} notification: ${message}`;
  };

  return (
    <div
      className={getToastStyles()}
      role="alert"
      aria-live="polite"
      aria-label={getAriaLabel()}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-current hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded"
        aria-label="Dismiss notification"
        type="button"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
