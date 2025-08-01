import React from "react";

/**
 * OutputPanel - A composable output section container component
 *
 * Purpose: Serves as a container for displaying output content in a structured layout.
 * This component is designed to be composable and stateless, accepting atomic children
 * such as output cards and organizing them in a cohesive display area.
 *
 * Design Philosophy:
 * - Composable: Designed to work with other components without tight coupling
 * - Stateless: Does not manage internal state, relying on props for all data
 * - Container: Provides structure and layout for child components
 * - Flexible: Accepts any valid React children to maximize reusability
 *
 * @param props - Component properties
 * @param props.children - Child components to render within the panel (typically output cards)
 * @param props.className - Optional CSS class name for styling customization
 * @returns JSX element representing the output panel container
 */

interface OutputPanelProps {
  /** Child components to be rendered within the output panel */
  children: React.ReactNode;
  /** Optional CSS class name for additional styling */
  className?: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ children, className }) => {
  return (
    <div
      className={`output-panel ${className || ""}`}
      role="region"
      aria-label="Output section"
    >
      {children}
    </div>
  );
};

export default OutputPanel;
