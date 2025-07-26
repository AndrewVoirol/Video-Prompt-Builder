import { useContext, createContext, useState, useEffect, ReactNode } from 'react';

/**
 * Theme mode options for the application.
 * Supports 'light', 'dark', and 'system' modes for comprehensive theming.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration interface.
 * Defines the structure for theme state management.
 */
export interface ThemeConfig {
  /** Current theme mode */
  mode: ThemeMode;
  /** Function to update the theme mode */
  setMode: (mode: ThemeMode) => void;
}

/**
 * Theme context for providing theme state throughout the component tree.
 * Used internally by the useTheme hook.
 */
const ThemeContext = createContext<ThemeConfig | undefined>(undefined);

/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: ReactNode;
  /** Default theme mode (defaults to 'system') */
  defaultMode?: ThemeMode;
}

/**
 * Theme provider component that wraps the application to provide theme context.
 * This should be placed at the root of your component tree.
 * 
 * @example
 * ```tsx
 * import { ThemeProvider } from './lib/hooks/useTheme';
 * 
 * function App() {
 *   return (
 *     <ThemeProvider defaultMode="system">
 *       <YourAppComponents />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  // Apply theme to document root for ShadCN/tweakcn compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
  }, [mode]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const value: ThemeConfig = {
    mode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom React hook for managing and accessing theme state.
 * 
 * Provides access to the current theme mode and a function to update it.
 * Works seamlessly with ShadCN/tweakcn components by applying theme classes
 * to the document root element.
 * 
 * @returns {ThemeConfig} Object containing current theme mode and setter function
 * 
 * @throws {Error} Throws an error if used outside of a ThemeProvider
 * 
 * @example
 * ```tsx
 * import { useTheme } from './lib/hooks/useTheme';
 * 
 * function ThemeToggle() {
 *   const { mode, setMode } = useTheme();
 * 
 *   const toggleTheme = () => {
 *     setMode(mode === 'light' ? 'dark' : 'light');
 *   };
 * 
 *   return (
 *     <button onClick={toggleTheme}>
 *       Switch to {mode === 'light' ? 'dark' : 'light'} mode
 *     </button>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // System mode support
 * function ThemeSelector() {
 *   const { mode, setMode } = useTheme();
 * 
 *   return (
 *     <select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeConfig {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Wrap your app or component tree with <ThemeProvider> to use this hook.'
    );
  }
  
  return context;
}

// Default export for convenience
export default useTheme;
