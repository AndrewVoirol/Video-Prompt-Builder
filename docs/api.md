# API Documentation

Comprehensive API documentation for Video-Prompt-Builder components, hooks, and utilities.

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Types](#types)
- [Configuration](#configuration)

## Components

### PromptBuilder

Main component for building video prompts with an interactive interface.

```tsx
import { PromptBuilder } from '@/components/PromptBuilder'

<PromptBuilder
  onPromptChange={(prompt: string) => void}
  onSubmit={(prompt: string) => void}
  initialPrompt?: string
  placeholder?: string
  disabled?: boolean
/>
```

#### Props

| Prop             | Type                       | Default                        | Description                             |
| ---------------- | -------------------------- | ------------------------------ | --------------------------------------- |
| `onPromptChange` | `(prompt: string) => void` | -                              | Callback fired when prompt text changes |
| `onSubmit`       | `(prompt: string) => void` | -                              | Callback fired when form is submitted   |
| `initialPrompt`  | `string`                   | `''`                           | Initial prompt text                     |
| `placeholder`    | `string`                   | `'Enter your video prompt...'` | Input placeholder text                  |
| `disabled`       | `boolean`                  | `false`                        | Whether the input is disabled           |

#### Example

```tsx
const MyComponent = () => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (prompt: string) => {
    console.log("Submitting prompt:", prompt);
    // Handle video generation
  };

  return (
    <PromptBuilder
      onPromptChange={setPrompt}
      onSubmit={handleSubmit}
      placeholder="Describe your video scene..."
    />
  );
};
```

### ThemeProvider

Provides theme context throughout the application.

```tsx
import { ThemeProvider } from "@/components/ThemeProvider";

<ThemeProvider theme="dark">{children}</ThemeProvider>;
```

#### Props

| Prop       | Type                          | Default  | Description      |
| ---------- | ----------------------------- | -------- | ---------------- |
| `theme`    | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme variant    |
| `children` | `ReactNode`                   | -        | Child components |

### Toast

Notification component for user feedback.

```tsx
import { Toast } from "@/components/Toast";

<Toast
  message="Prompt saved successfully!"
  type="success"
  onClose={() => setShowToast(false)}
/>;
```

#### Props

| Prop       | Type                                          | Default  | Description                   |
| ---------- | --------------------------------------------- | -------- | ----------------------------- |
| `message`  | `string`                                      | -        | Toast message content         |
| `type`     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast variant                 |
| `duration` | `number`                                      | `3000`   | Auto-dismiss duration in ms   |
| `onClose`  | `() => void`                                  | -        | Callback when toast is closed |

## Hooks

### useTheme

Hook for accessing and managing theme state.

```tsx
import { useTheme } from "@/lib/useTheme";

const { theme, setTheme, toggleTheme } = useTheme();
```

#### Returns

| Property      | Type                                 | Description                   |
| ------------- | ------------------------------------ | ----------------------------- |
| `theme`       | `'light' \| 'dark'`                  | Current theme                 |
| `setTheme`    | `(theme: 'light' \| 'dark') => void` | Set theme explicitly          |
| `toggleTheme` | `() => void`                         | Toggle between light and dark |

### usePromptHistory

Hook for managing prompt history and persistence.

```tsx
import { usePromptHistory } from "@/lib/usePromptHistory";

const { history, addPrompt, clearHistory, removePrompt } = usePromptHistory();
```

#### Returns

| Property       | Type                       | Description            |
| -------------- | -------------------------- | ---------------------- |
| `history`      | `PromptHistoryItem[]`      | Array of saved prompts |
| `addPrompt`    | `(prompt: string) => void` | Add prompt to history  |
| `clearHistory` | `() => void`               | Clear all history      |
| `removePrompt` | `(id: string) => void`     | Remove specific prompt |

### useLocalStorage

Hook for persistent local storage with TypeScript support.

```tsx
import { useLocalStorage } from "@/lib/useLocalStorage";

const [value, setValue] = useLocalStorage<string>("key", "defaultValue");
```

#### Parameters

| Parameter      | Type     | Description   |
| -------------- | -------- | ------------- |
| `key`          | `string` | Storage key   |
| `initialValue` | `T`      | Default value |

#### Returns

| Return     | Type                 | Description          |
| ---------- | -------------------- | -------------------- |
| `value`    | `T`                  | Current stored value |
| `setValue` | `(value: T) => void` | Update stored value  |

## Utilities

### validatePrompt

Validates prompt content and structure.

```tsx
import { validatePrompt } from "@/lib/validation";

const result = validatePrompt(promptText);
```

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `prompt`  | `string` | Prompt text to validate |

#### Returns

```tsx
type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};
```

### formatPrompt

Formats and sanitizes prompt text.

```tsx
import { formatPrompt } from "@/lib/utils";

const formatted = formatPrompt(rawPrompt);
```

### generatePromptId

Generates unique identifiers for prompts.

```tsx
import { generatePromptId } from "@/lib/utils";

const id = generatePromptId(); // Returns string like 'prompt_1234567890'
```

## Types

### Core Types

```tsx
// Prompt-related types
type PromptIntent = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  domain?: string;
};

type PromptHistoryItem = {
  id: string;
  prompt: string;
  timestamp: number;
  title?: string;
};

// Theme types
type Theme = "light" | "dark";
type ThemeMode = Theme | "auto";

// Component prop types
type PromptBuilderProps = {
  onPromptChange: (prompt: string) => void;
  onSubmit: (prompt: string) => void;
  initialPrompt?: string;
  placeholder?: string;
  disabled?: boolean;
};

type ToastProps = {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
};
```

### Event Types

```tsx
type PromptChangeEvent = {
  prompt: string;
  timestamp: number;
  source: "user" | "system";
};

type PromptSubmitEvent = {
  prompt: string;
  metadata: {
    length: number;
    wordCount: number;
    timestamp: number;
  };
};
```

## Configuration

### Environment Variables

```env
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_MAX_PROMPT_LENGTH=1000
```

### Theme Configuration

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        // Additional theme colors
      },
    },
  },
};
```

### Default Settings

```tsx
// lib/constants.ts
export const DEFAULT_SETTINGS = {
  theme: "auto" as ThemeMode,
  maxPromptLength: 1000,
  autoSave: true,
  historyLimit: 50,
  toastDuration: 3000,
} as const;
```

## Error Handling

### Error Boundaries

The application includes error boundaries for graceful error handling:

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary fallback={<ErrorFallback />}>
  <PromptBuilder />
</ErrorBoundary>;
```

### Common Error Types

```tsx
type PromptError = {
  code: "VALIDATION_ERROR" | "STORAGE_ERROR" | "NETWORK_ERROR";
  message: string;
  details?: Record<string, any>;
};
```

## Testing

### Component Testing

```tsx
import { render, screen } from "@testing-library/react";
import { PromptBuilder } from "@/components/PromptBuilder";

test("renders prompt builder", () => {
  render(<PromptBuilder onPromptChange={jest.fn()} onSubmit={jest.fn()} />);

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});
```

### Hook Testing

```tsx
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/lib/useTheme";

test("useTheme toggles theme", () => {
  const { result } = renderHook(() => useTheme());

  act(() => {
    result.current.toggleTheme();
  });

  expect(result.current.theme).toBe("dark");
});
```

## Migration Guide

### From v1.x to v2.x

- `PromptBuilder` component now requires `onPromptChange` prop
- Theme system updated to support auto mode
- Local storage format changed (automatic migration included)

### Breaking Changes

- Removed deprecated `LegacyPromptBuilder` component
- Changed `useSettings` hook API
- Updated TypeScript definitions for better type safety

---

**Last Updated:** July 26, 2025
**Version:** 2.0.0

For more information, see the [main README](../README.md) or visit our [GitHub repository](https://github.com/AndrewVoirol/Video-Prompt-Builder).
