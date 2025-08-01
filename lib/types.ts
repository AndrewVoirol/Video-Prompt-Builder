/**
 * Global type & interface definitions for Video Prompt Builder.
 * Use these throughout the app for strict typing and TS/IDE clarity.
 */

/**
 * Prompt interface represents the main builder object for a video AI prompt.
 */
export interface Prompt {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * FieldConfig defines how a single form field should be rendered and validated.
 */
export interface FieldConfig {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: string | number | boolean;
  helpText?: string;
  order?: number;
}

/**
 * OutputFormat defines serialization/display method for a builder output.
 */
export interface OutputFormat {
  id: string;
  name: string;
  description?: string;
  type: "json" | "text" | "html" | "markdown";
}

/**
 * Theme and palette configuration types.
 */
export type ThemeMode = "light" | "dark" | "system";
export interface ThemeConfig {
  name: string;
  palette: Record<string, string>;
}

/**
 * Registry describes structure of preset and intent registries.
 */
export interface Registry<T> {
  [id: string]: T;
}
