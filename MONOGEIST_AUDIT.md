# MonoGeist Theme Implementation Audit

## Executive Summary

This document provides a comprehensive audit of the current MonoGeist theme implementation in the Video Prompt Builder application, analyzing all style sources and providing comparison points for tweakcn reference implementation.

## Style Sources Inventory

### 1. Main Configuration Files

#### **tailwind.config.js**

- Status: **Minimal/Legacy**
- Content: Contains only compatibility comments for Tailwind v4
- Note: Actual configuration handled via `@theme inline` in globals.css

#### **components.json** (shadcn configuration)

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  }
}
```

### 2. Primary Theme Implementation

#### **app/globals.css** - MonoGeist Theme Variables

```css
/* === MonoGeist Theme === */
[data-theme="monogeist"] {
  /* Color Palette */
  --background: oklch(1 0 0); /* Pure white */
  --foreground: oklch(0.1448 0 0); /* Very dark gray */
  --card: oklch(1 0 0); /* Pure white */
  --card-foreground: oklch(0.1448 0 0); /* Very dark gray */
  --primary: oklch(0.5555 0 0); /* Medium gray */
  --secondary: oklch(0.9702 0 0); /* Light gray */
  --muted: oklch(0.9702 0 0); /* Light gray */
  --accent: oklch(0.9702 0 0); /* Light gray */
  --border: oklch(0.9219 0 0); /* Light gray border */
  --input: oklch(0.9219 0 0); /* Light gray input */
  --ring: oklch(0.709 0 0); /* Focus ring gray */

  /* Typography */
  --font-sans: Geist Mono, monospace;
  --font-serif: Geist Mono, monospace;
  --font-mono: Geist Mono, monospace;

  /* Layout */
  --radius: 0rem; /* No border radius */
  --spacing: 0.25rem;

  /* Shadows - All DISABLED (0 opacity) */
  --shadow-2xs: 0px 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-xs: 0px 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-sm:
    0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow: 0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow-md:
    0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 2px 4px -1px hsl(0 0% 0% / 0);
  --shadow-lg:
    0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 4px 6px -1px hsl(0 0% 0% / 0);
  --shadow-xl:
    0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 8px 10px -1px hsl(0 0% 0% / 0);
  --shadow-2xl: 0px 1px 0px 0px hsl(0 0% 0% / 0);
}

/* Dark Mode Variant */
[data-theme="monogeist"].dark {
  --background: oklch(0.1448 0 0); /* Very dark */
  --foreground: oklch(0.9851 0 0); /* Near white */
  --card: oklch(0.2134 0 0); /* Dark gray */
  --card-foreground: oklch(0.9851 0 0); /* Near white */
  /* ... other dark mode variables */
}
```

### 3. Component Implementations

#### **Button Component** (`components/ui/button.tsx`)

**Key Styling Classes:**

- Base: `"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all"`
- Variants:
  - Default: `"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"`
  - Outline: `"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"`
  - Secondary: `"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"`

#### **Card Component** (`components/ui/card.tsx`)

**Key Styling Classes:**

- Base: `"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"`
- Header: `"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6"`
- Title: `"leading-none font-semibold"`
- Description: `"text-muted-foreground text-sm"`

### 4. Theme Management System

#### **Theme Provider** (`components/theme-provider.tsx`)

- **Light/Dark Theme Control**: Uses CSS classes `.light` and `.dark`
- **Color Scheme Control**: Uses `data-theme` attribute
- **Storage**: localStorage for persistence
- **View Transitions**: Supports CSS view transitions with coordinate-based animations

#### **Theme Configuration** (`lib/themes.ts`)

```typescript
{
  name: "MonoGeist",
  label: "MonoGeist",
  value: "monogeist",
  preview: {
    primary: "oklch(0.2050 0 0)",
    secondary: "oklch(0.9700 0 0)",
    accent: "oklch(0.9700 0 0)",
  },
}
```

## Current MonoGeist Characteristics

### **Typography**

- **All fonts**: Geist Mono (monospace)
- **Approach**: Uniform monospace across sans, serif, and mono variants
- **Character**: Technical, code-like aesthetic

### **Color Scheme**

- **Philosophy**: Achromatic (no color saturation)
- **Light Mode**: Pure white backgrounds, dark gray text
- **Dark Mode**: Very dark backgrounds, light gray text
- **Contrast Strategy**: High contrast, minimal intermediary grays

### **Layout & Spacing**

- **Border Radius**: 0rem (sharp corners throughout)
- **Shadows**: Completely disabled (0 opacity)
- **Aesthetic**: Flat, minimal, technical

### **Interactive States**

- **Focus States**: Ring-based focus indicators
- **Hover States**: Opacity-based (e.g., `hover:bg-primary/90`)
- **Transitions**: Standard duration with cubic-bezier easing

## Comparison Matrix Framework

### **Elements to Compare with tweakcn Reference:**

1. **Cards**
   - Border radius (current: 0rem)
   - Shadow implementation (current: disabled)
   - Border styling
   - Background colors
   - Content spacing

2. **Panels/Containers**
   - Background treatment
   - Border implementation
   - Spacing patterns
   - Nested container handling

3. **Shadows**
   - Current: All disabled (opacity: 0)
   - Need: tweakcn reference shadow values
   - Levels: 2xs, xs, sm, md, lg, xl, 2xl

4. **Borders**
   - Current: `oklch(0.9219 0 0)` (light), `oklch(0.3407 0 0)` (dark)
   - Style: Standard 1px solid
   - Radius: 0rem universally

5. **Typography**
   - Font stack: Geist Mono (uniform)
   - Line heights and spacing
   - Weight distribution
   - Text color hierarchy

## Identified Gaps Requiring tweakcn Reference

### **Critical Missing Information:**

1. **Official tweakcn MonoGeist shadow values** - Currently all disabled
2. **Reference border radius values** - May not actually be 0rem
3. **Typography specifications** - Confirm Geist Mono usage patterns
4. **Interactive state specifications** - Hover/focus treatments
5. **Component-specific styling** - Card implementations, button variants

### **Action Items for Reference Capture:**

1. Access tweakcn MonoGeist theme registry
2. Screenshot reference components (cards, buttons, forms)
3. Extract CSS custom property values
4. Document shadow implementations
5. Verify typography and spacing specifications

## Technical Implementation Notes

### **Tailwind v4 Integration:**

- Uses `@theme inline` directive in globals.css
- CSS custom properties mapped to Tailwind color system
- No traditional tailwind.config.js configuration

### **Theme Switching:**

- Supports CSS View Transitions API
- Coordinate-based transition effects
- LocalStorage persistence
- System theme detection

### **Component Architecture:**

- shadcn/ui component system
- Class Variance Authority (CVA) for variants
- Radix UI primitives for accessibility
- Custom data-slot attributes for styling hooks

---

**Next Steps**: Require access to tweakcn reference implementation to complete comparison matrix and identify specific styling discrepancies.
