import React from 'react';

interface LayoutProps {
  /** Child components to be wrapped by the Layout */
  children: React.ReactNode;
}

/**
 * Layout Component
 * 
 * Global application shell and wrapper for providers.
 * This component serves as the main container for the entire application,
 * providing a consistent structure and serving as a wrapper for any
 * global providers, contexts, or styling systems.
 * 
 * @param children - The child components to be rendered within the layout
 * @returns JSX.Element - The layout wrapper containing all child components
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
