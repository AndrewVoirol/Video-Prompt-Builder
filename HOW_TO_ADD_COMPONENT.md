# HOW TO ADD A COMPONENT

This guide explains how to add a new component to the Video-Prompt-Builder using the shadcn/ui approach with tweakcn.

## Prerequisites

Before adding components, ensure you have:

- Node.js 20.11.0+ installed
- pnpm package manager
- Basic understanding of React, TypeScript, and TailwindCSS

## shadcn/ui Component Installation

### Using the CLI (Recommended)

1. **Install a shadcn/ui component:**

   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Install multiple components at once:**

   ```bash
   npx shadcn@latest add button card input label
   ```

3. **View available components:**
   ```bash
   npx shadcn@latest add --help
   ```

### Manual Component Creation

If you need to create a custom component or modify an existing one:

#### 1. Component Structure

Components are organized in the following structure:

```
components/
├── ui/           # shadcn/ui base components
├── custom/       # Custom application components
└── layout/       # Layout-specific components
```

#### 2. Create the Component File

Create your component in the appropriate directory:

**For UI components** (`components/ui/`):

```typescript
// components/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const myComponentVariants = cva(
  "base-styles", // Base styles
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  asChild?: boolean
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <div
        className={cn(myComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent, myComponentVariants }
```

**For custom components** (`components/custom/`):

```typescript
// components/custom/my-custom-component.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MyCustomComponentProps {
  title: string
  onAction?: () => void
}

export function MyCustomComponent({ title, onAction }: MyCustomComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>Action</Button>
      </CardContent>
    </Card>
  )
}
```

#### 3. Theme Integration

Ensure your component uses the theme system:

```typescript
// Use CSS variables defined in globals.css
const themedStyles = "bg-background text-foreground border border-border";

// Or use theme-aware Tailwind classes
const adaptiveStyles = "bg-card text-card-foreground dark:bg-card-dark";
```

#### 4. Export from Index

Add your component to the appropriate index file:

```typescript
// components/ui/index.ts
export { MyComponent } from "./my-component";

// components/custom/index.ts
export { MyCustomComponent } from "./my-custom-component";

// components/index.ts
export * from "./ui";
export * from "./custom";
export * from "./layout";
```

## Configuration Files

### components.json

Our project uses the following shadcn/ui configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### TailwindCSS Integration

Components automatically inherit theme variables from `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... other theme variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

## Testing Components

### Unit Tests

Create tests in the `tests` directory:

```typescript
// tests/components/my-component.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/ui/my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Test content</MyComponent>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies variant styles correctly', () => {
    render(<MyComponent variant="secondary">Secondary</MyComponent>)
    expect(screen.getByText('Secondary')).toHaveClass('secondary-styles')
  })
})
```

### Accessibility Testing

Run accessibility tests:

```bash
# Run accessibility test script
node scripts/accessibility-test.js

# Or test specific components
pnpm test -- --testNamePattern="MyComponent accessibility"
```

## Integration Steps

### 1. Import and Use

```typescript
// In your page or component
import { MyComponent } from '@/components/ui/my-component'
import { MyCustomComponent } from '@/components/custom/my-custom-component'

export default function MyPage() {
  return (
    <div>
      <MyComponent variant="secondary" size="lg">
        Content
      </MyComponent>
      <MyCustomComponent title="Custom Title" onAction={() => console.log('Action!')} />
    </div>
  )
}
```

### 2. Type Safety

Ensure proper TypeScript integration:

```typescript
// lib/types.ts - Add component-specific types
export interface ComponentConfig {
  variant: "default" | "secondary";
  size: "sm" | "default" | "lg";
}
```

### 3. Storybook (Optional)

If using Storybook, create stories:

```typescript
// stories/MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@/components/ui/my-component";

const meta: Meta<typeof MyComponent> = {
  title: "UI/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default MyComponent",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary MyComponent",
  },
};
```

## Best Practices

### 1. Follow shadcn/ui Patterns

- Use `forwardRef` for UI components
- Implement `asChild` prop when appropriate
- Use `class-variance-authority` for variant management
- Follow the compound component pattern for complex components

### 2. Theme Consistency

- Always use CSS variables for theming
- Ensure components work in all available themes
- Test both light and dark modes
- Use proper CSS variable references: `var(--color-surface-code)` not `var(--surface-code)`

### 3. React Styling Conflict Prevention

**Critical**: Avoid React background/backgroundColor conflicts in styled components:

```typescript
// ❌ Problem: Mixed shorthand and longhand properties
const badStyle = {
  background: 'white',
  backgroundColor: 'var(--color-surface)', // Conflict!
};

// ✅ Solution: Clean conflicting properties
const cleanThemeStyles = React.useMemo(() => {
  const cleaned = { ...themeStyles };
  
  // Remove ALL background-related properties
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
      const { 
        background, 
        backgroundColor, 
        backgroundImage, 
        backgroundAttachment,
        backgroundClip,
        backgroundOrigin,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
        ...rest 
      } = cleaned[key];
      cleaned[key] = rest;
    }
  });
  
  return cleaned;
}, [themeStyles]);

// Only use backgroundColor in final styles
const safeStyle = {
  ...cleanThemeStyles,
  backgroundColor: 'var(--color-surface-code)', // Safe!
};
```

### 4. Accessibility

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

### 5. Performance

- Use React.memo for expensive components
- Implement proper prop types and defaults
- Avoid unnecessary re-renders
- Use `React.useMemo` for expensive style calculations

## Troubleshooting

### Common Issues

1. **Component not found**: Ensure proper export/import paths
2. **Styling issues**: Check CSS variable definitions and Tailwind config
3. **Theme not applied**: Verify ThemeProvider is wrapping your app
4. **TypeScript errors**: Ensure proper type definitions and exports

### Debugging Tips

```bash
# Check component structure
npx shadcn@latest list

# Validate Tailwind config
npx tailwindcss --help

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [Class Variance Authority](https://cva.style/docs)

By following this guide, you'll be able to seamlessly add and integrate components into the Video-Prompt-Builder ecosystem while maintaining consistency, accessibility, and performance standards.
