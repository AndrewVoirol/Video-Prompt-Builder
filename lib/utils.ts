/**
 * @fileoverview Utility functions for general use across application modules.
 * 
 * This module provides a collection of strictly typed, well-documented utility
 * functions that can be used throughout the application. These utilities include
 * deep cloning, debouncing, emptiness checking, and other common operations.
 * 
 * @module utils
 * @version 1.0.0
 */

import { type ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges Tailwind CSS classes using tailwind-merge.
 * This is the standard utility function used in shadcn/ui components.
 * 
 * @param {...ClassValue[]} inputs - Class values to combine and merge
 * @returns {string} The merged class string
 * 
 * @example
 * ```typescript
 * cn("px-2 py-1", "px-3") // "py-1 px-3"
 * cn("text-red-500", condition && "text-blue-500") // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Creates a deep clone of the provided value, recursively copying all nested objects and arrays.
 * 
 * @template T - The type of the value to clone
 * @param {T} value - The value to deep clone
 * @returns {T} A deep copy of the input value
 * 
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2, d: [3, 4] } };
 * const cloned = deepClone(original);
 * cloned.b.c = 99;
 * console.log(original.b.c); // Still 2
 * ```
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof Array) {
    return value.map(item => deepClone(item)) as T;
  }

  if (typeof value === 'object') {
    const clonedObj = {} as T;
    Object.keys(value).forEach(key => {
      (clonedObj as Record<string, unknown>)[key] = deepClone((value as Record<string, unknown>)[key]);
    });
    return clonedObj;
  }

  return value;
}

/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 * 
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} The debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * debouncedSearch('a');     // Will not execute immediately
 * debouncedSearch('ab');    // Cancels previous, will not execute immediately
 * debouncedSearch('abc');   // Cancels previous, executes after 300ms
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Checks if a value is empty. Returns true for null, undefined, empty strings,
 * empty arrays, empty objects, and objects with no enumerable properties.
 * 
 * @param {unknown} value - The value to check for emptiness
 * @returns {boolean} True if the value is considered empty, false otherwise
 * 
 * @example
 * ```typescript
 * isEmpty(null);          // true
 * isEmpty(undefined);     // true
 * isEmpty('');            // true
 * isEmpty([]);            // true
 * isEmpty({});            // true
 * isEmpty({ a: 1 });      // false
 * isEmpty('hello');       // false
 * isEmpty([1, 2, 3]);     // false
 * isEmpty(0);             // false
 * isEmpty(false);         // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  // Handle null and undefined
  if (value == null) {
    return true;
  }

  // Handle strings
  if (typeof value === 'string') {
    return value.length === 0;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Handle objects
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  // For primitives like numbers, booleans, etc., they are not considered empty
  return false;
}

/**
 * Type guard to check if a value is not null or undefined.
 * Useful for filtering arrays and type narrowing.
 * 
 * @template T - The type of the value to check
 * @param {T | null | undefined} value - The value to check
 * @returns {value is T} True if the value is not null or undefined
 * 
 * @example
 * ```typescript
 * const items = [1, null, 2, undefined, 3];
 * const validItems = items.filter(isNotNullish); // Type: number[]
 * console.log(validItems); // [1, 2, 3]
 * ```
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely gets a nested property from an object using a dot-notation path.
 * Returns undefined if any part of the path doesn't exist.
 * 
 * @template T - The expected return type
 * @param {Record<string, any>} obj - The object to traverse
 * @param {string} path - The dot-notation path to the property
 * @returns {T | undefined} The value at the path, or undefined if not found
 * 
 * @example
 * ```typescript
 * const data = { user: { profile: { name: 'John' } } };
 * const name = safeGet<string>(data, 'user.profile.name');  // 'John'
 * const age = safeGet<number>(data, 'user.profile.age');    // undefined
 * const invalid = safeGet(data, 'user.invalid.path');       // undefined
 * ```
 */
export function safeGet<T = unknown>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T;
}
