import React from 'react';

/**
 * Skeleton component - An atomic loading/placeholder element for async state in UIs.
 * 
 * This component renders a visually consistent placeholder that indicates content
 * is loading or temporarily unavailable. It provides a better user experience than
 * blank spaces or spinners by showing the approximate shape and size of the
 * content that will appear.
 * 
 * @param props - The component props
 * @param props.width - The width of the skeleton element (CSS value: px, %, rem, etc.)
 * @param props.height - The height of the skeleton element (CSS value: px, %, rem, etc.)
 * @param props.className - Additional CSS classes to apply to the skeleton element
 */
export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default Skeleton;
