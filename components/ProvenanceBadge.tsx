import React from 'react';

/**
 * ProvenanceBadge is an inline badge component used for displaying attribution
 * or status information next to fields and outputs. It provides visual context
 * about the source, status, or metadata of the associated content.
 *
 * @param props - The component props
 * @param props.status - The status type that determines the badge appearance
 * @param props.label - The text content to display in the badge
 * @returns A styled inline badge element
 */
interface ProvenanceBadgeProps {
  /** The status type that determines the badge's visual style */
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** The text content to display within the badge */
  label: string;
}

const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ status, label }) => {
  const getStatusClasses = (status: ProvenanceBadgeProps['status']): string => {
    const baseClasses = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'neutral':
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <span className={getStatusClasses(status)} role="status" aria-label={`${status}: ${label}`}>
      {label}
    </span>
  );
};

export default ProvenanceBadge;
