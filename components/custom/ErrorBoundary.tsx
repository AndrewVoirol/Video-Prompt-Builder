import React, { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Props interface for the ErrorBoundary component.
 * @interface ErrorBoundaryProps
 */
interface ErrorBoundaryProps {
  /**
   * The child components to be rendered within the error boundary.
   * @type {ReactNode}
   */
  children: ReactNode;
  
  /**
   * Optional fallback UI to render when an error is caught.
   * Can be a ReactNode or a function that receives the error and errorInfo.
   * @type {ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode)}
   * @optional
   */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  
  /**
   * Optional callback function called when an error is caught.
   * Useful for error reporting and logging services.
   * @type {(error: Error, errorInfo: ErrorInfo) => void}
   * @optional
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State interface for the ErrorBoundary component.
 * @interface ErrorBoundaryState
 */
interface ErrorBoundaryState {
  /**
   * Indicates whether an error has been caught.
   * @type {boolean}
   */
  hasError: boolean;
  
  /**
   * The caught error object, null if no error has occurred.
   * @type {Error | null}
   */
  error: Error | null;
  
  /**
   * Additional error information provided by React.
   * @type {ErrorInfo | null}
   */
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - A React class component that catches JavaScript errors anywhere in the child component tree.
 * 
 * This component serves as the atomic error-handling wrapper for the application. It provides a safety net
 * that prevents the entire application from crashing when errors occur in child components. Instead, it
 * gracefully handles errors by:
 * 
 * 1. Catching errors during rendering, in lifecycle methods, and in constructors of the whole tree below them
 * 2. Logging error details for debugging and monitoring purposes
 * 3. Displaying a fallback UI instead of the component tree that crashed
 * 4. Preventing error propagation up the component tree
 * 
 * ## Usage as Atomic Error Handler:
 * 
 * The ErrorBoundary should be used as a wrapper around critical sections of your application:
 * 
 * ```tsx
 * // Wrap entire app sections
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <App />
 * </ErrorBoundary>
 * 
 * // Wrap specific features
 * <ErrorBoundary fallback={<div>Something went wrong with this feature.</div>}>
 *   <FeatureComponent />
 * </ErrorBoundary>
 * 
 * // With error reporting
 * <ErrorBoundary 
 *   fallback={(error, errorInfo) => <CustomErrorUI error={error} />}
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 * >
 *   <CriticalComponent />
 * </ErrorBoundary>
 * ```
 * 
 * ## Error Boundary Limitations:
 * 
 * Note that error boundaries do NOT catch errors for:
 * - Event handlers (use try-catch for these)
 * - Asynchronous code (e.g., setTimeout or requestAnimationFrame callbacks)
 * - Errors thrown during server-side rendering
 * - Errors thrown in the error boundary itself (rather than its children)
 * 
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 * @since 1.0.0
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Creates an instance of ErrorBoundary.
   * 
   * @param {ErrorBoundaryProps} props - The props for the ErrorBoundary component
   * @memberof ErrorBoundary
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    // Initialize state with no error
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static lifecycle method called when an error is thrown by a descendant component.
   * This method is used to update the component state in response to an error.
   * 
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {Partial<ErrorBoundaryState>} - Updated state object
   * @memberof ErrorBoundary
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to indicate that an error has occurred
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called when an error is caught by this error boundary.
   * This method is used for side effects like error reporting and logging.
   * 
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional information about the error
   * @memberof ErrorBoundary
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with detailed error information
    this.setState({
      errorInfo,
    });

    // Call the onError callback if provided for external error handling
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console for development debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
  }

  /**
   * Method to reset the error boundary state, allowing recovery from errors.
   * This can be called by parent components or triggered by user actions.
   * 
   * @memberof ErrorBoundary
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Renders the component. Shows either the children or the fallback UI based on error state.
   * 
   * @returns {ReactNode} The rendered component
   * @memberof ErrorBoundary
   */
  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    // If an error has been caught, render the fallback UI
    if (hasError && error) {
      // If fallback is a function, call it with error details
      if (typeof fallback === 'function') {
        return fallback(error, errorInfo || { componentStack: '' });
      }
      
      // If fallback is provided as a ReactNode, render it
      if (fallback) {
        return fallback;
      }
      
      // Default fallback UI if none provided
      return (
        <div 
          role="alert" 
          style={{
            padding: '20px',
            border: '1px solid #ff6b6b',
            borderRadius: '4px',
            backgroundColor: '#ffe0e0',
            color: '#d63031',
            fontFamily: 'monospace',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
            Something went wrong
          </h2>
          <details style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
              Error Details
            </summary>
            <strong>Error:</strong> {error.message}
            {errorInfo && (
              <>
                <br />
                <strong>Component Stack:</strong>
                {errorInfo.componentStack}
              </>
            )}
          </details>
          <button
            onClick={this.resetErrorBoundary}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#d63031',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return children;
  }
}

export default ErrorBoundary;
