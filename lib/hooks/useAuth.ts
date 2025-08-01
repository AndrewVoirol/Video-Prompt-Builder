/**
 * Authentication context consumer hook
 *
 * This hook provides access to the authentication context, allowing components
 * to access user state and authentication functions throughout the application.
 *
 * @returns {Object} Authentication state and functions
 * @returns {User | null} user - The current authenticated user or null
 * @returns {boolean} isAuthenticated - Whether the user is currently authenticated
 * @returns {Function} login - Function to authenticate a user
 * @returns {Function} logout - Function to log out the current user
 */

import { useState, useCallback } from "react";

// Type definitions for the authentication hook
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * useAuth hook - provides authentication state and functions
 */
export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      // TODO: Implement actual authentication logic
      // This is a stub implementation
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Use password parameter for actual authentication
        console.log(
          "Authenticating with password:",
          password ? "***" : "empty",
        );

        // Mock user data
        const mockUser: User = {
          id: "1",
          email,
          name: "Mock User",
        };

        setUser(mockUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback((): void => {
    // TODO: Implement actual logout logic
    // This is a stub implementation
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
