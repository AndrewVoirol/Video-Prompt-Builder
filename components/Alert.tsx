import React from 'react';

/**
 * Props interface for the Alert component
 */
interface AlertProps {
  /** Type of alert - determines styling and visual appearance */
  type: 'info' | 'warning' | 'error';
  /** Main message content to display in the alert */
  message: string;
  /** Optional children content for additional elements or custom content */
  children?: React.ReactNode;
}

/**
 * Alert Component
 * 
 * An atomic status or notification component for displaying information, warnings,
 * or error states to users. This component provides a consistent visual interface
 * for communicating different types of system messages and user feedback.
 * 
 * @example
 * ```tsx
 * <Alert type="info" message="Operation completed successfully" />
 * <Alert type="warning" message="Please review your input">
 *   <button>Dismiss</button>
 * </Alert>
 * <Alert type="error" message="An error occurred" />
 * ```
 * 
 * @param props - The component props
 * @param props.type - The alert type (info, warning, error)
 * @param props.message - The message to display
 * @param props.children - Optional additional content
 * @returns JSX.Element representing the alert component
 */
const Alert: React.FC<AlertProps> = ({ type, message, children }) => {
  const baseClasses = 'alert alert-base';
  const typeClasses = {
    info: 'alert-info',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        {children && <div className="alert-children">{children}</div>}
      </div>
    </div>
  );
};

export default Alert;
