# MonoGeist CSS Technical Snapshot

## CSS Custom Properties - Current Implementation

### Light Mode Variables

```css
[data-theme="monogeist"] {
  /* === PRIMARY COLOR SCHEME === */
  --background: oklch(1 0 0); /* #ffffff - Pure white */
  --foreground: oklch(0.1448 0 0); /* #252525 - Very dark gray */
  --card: oklch(1 0 0); /* #ffffff - Pure white */
  --card-foreground: oklch(0.1448 0 0); /* #252525 - Very dark gray */
  --popover: oklch(1 0 0); /* #ffffff - Pure white */
  --popover-foreground: oklch(0.1448 0 0); /* #252525 - Very dark gray */

  /* === SEMANTIC COLORS === */
  --primary: oklch(0.5555 0 0); /* #8e8e8e - Medium gray */
  --primary-foreground: oklch(0.9851 0 0); /* #fbfbfb - Off-white */
  --secondary: oklch(0.9702 0 0); /* #f7f7f7 - Light gray */
  --secondary-foreground: oklch(0.2046 0 0); /* #343434 - Dark gray */
  --muted: oklch(0.9702 0 0); /* #f7f7f7 - Light gray */
  --muted-foreground: oklch(0.5486 0 0); /* #8c8c8c - Medium gray */
  --accent: oklch(0.9702 0 0); /* #f7f7f7 - Light gray */
  --accent-foreground: oklch(0.2046 0 0); /* #343434 - Dark gray */
  --destructive: oklch(0.583 0.2387 28.4765); /* #dc2626 - Red */
  --destructive-foreground: oklch(0.9702 0 0); /* #f7f7f7 - Light gray */

  /* === BORDER & INPUT === */
  --border: oklch(0.9219 0 0); /* #ebebeb - Light border */
  --input: oklch(0.9219 0 0); /* #ebebeb - Light input */
  --ring: oklch(0.709 0 0); /* #b5b5b5 - Focus ring */

  /* === CHART COLORS === */
  --chart-1: oklch(0.5555 0 0); /* #8e8e8e - All charts same gray */
  --chart-2: oklch(0.5555 0 0);
  --chart-3: oklch(0.5555 0 0);
  --chart-4: oklch(0.5555 0 0);
  --chart-5: oklch(0.5555 0 0);

  /* === SIDEBAR COLORS === */
  --sidebar: oklch(0.9851 0 0); /* #fbfbfb - Off-white */
  --sidebar-foreground: oklch(0.1448 0 0); /* #252525 - Dark text */
  --sidebar-primary: oklch(0.2046 0 0); /* #343434 - Dark primary */
  --sidebar-primary-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */
  --sidebar-accent: oklch(0.9702 0 0); /* #f7f7f7 - Light accent */
  --sidebar-accent-foreground: oklch(0.2046 0 0); /* #343434 - Dark text */
  --sidebar-border: oklch(0.9219 0 0); /* #ebebeb - Light border */
  --sidebar-ring: oklch(0.709 0 0); /* #b5b5b5 - Focus ring */

  /* === TYPOGRAPHY === */
  --font-sans: Geist Mono, monospace;
  --font-serif: Geist Mono, monospace;
  --font-mono: Geist Mono, monospace;

  /* === LAYOUT === */
  --radius: 0rem; /* Sharp corners everywhere */
  --spacing: 0.25rem; /* 4px base spacing */

  /* === SHADOWS - ALL DISABLED === */
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
```

### Dark Mode Variables

```css
[data-theme="monogeist"].dark {
  /* === PRIMARY COLOR SCHEME === */
  --background: oklch(0.1448 0 0); /* #252525 - Very dark */
  --foreground: oklch(0.9851 0 0); /* #fbfbfb - Off-white */
  --card: oklch(0.2134 0 0); /* #363636 - Dark gray card */
  --card-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */
  --popover: oklch(0.2686 0 0); /* #454545 - Medium dark */
  --popover-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */

  /* === SEMANTIC COLORS === */
  --primary: oklch(0.5555 0 0); /* #8e8e8e - Same medium gray */
  --primary-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */
  --secondary: oklch(0.2686 0 0); /* #454545 - Dark secondary */
  --secondary-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */
  --muted: oklch(0.2686 0 0); /* #454545 - Dark muted */
  --muted-foreground: oklch(0.709 0 0); /* #b5b5b5 - Medium light */
  --accent: oklch(0.3715 0 0); /* #5f5f5f - Medium dark accent */
  --accent-foreground: oklch(0.9851 0 0); /* #fbfbfb - Light text */
  --destructive: oklch(0.7022 0.1892 22.2279); /* #ef4444 - Lighter red */
  --destructive-foreground: oklch(0.2686 0 0); /* #454545 - Dark text */

  /* === BORDER & INPUT === */
  --border: oklch(0.3407 0 0); /* #575757 - Medium border */
  --input: oklch(0.4386 0 0); /* #707070 - Medium input */
  --ring: oklch(0.5555 0 0); /* #8e8e8e - Same focus ring */

  /* ... sidebar colors with similar dark adjustments ... */
}
```

## Component CSS Classes Analysis

### Button Component

```css
/* Base button classes */
.button-base {
  @apply inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50;
  @apply outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px];
  @apply aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive;
}

/* Variant: Default */
.button-default {
  @apply bg-primary text-primary-foreground shadow-xs hover:bg-primary/90;
}

/* Variant: Outline */
.button-outline {
  @apply border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground;
  @apply dark:bg-input/30 dark:border-input dark:hover:bg-input/50;
}

/* Variant: Secondary */
.button-secondary {
  @apply bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80;
}

/* Variant: Ghost */
.button-ghost {
  @apply hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50;
}
```

### Card Component

```css
/* Base card classes */
.card-base {
  @apply bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm;
  /* Note: rounded-xl conflicts with --radius: 0rem setting */
}

.card-header {
  @apply @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6;
  @apply has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6;
}

.card-title {
  @apply leading-none font-semibold;
}

.card-description {
  @apply text-muted-foreground text-sm;
}

.card-content {
  @apply px-6;
}

.card-footer {
  @apply flex items-center px-6 [.border-t]:pt-6;
}
```

## Critical Styling Conflicts

### 1. Border Radius Inconsistency

- **CSS Variable**: `--radius: 0rem` (no border radius)
- **Component Classes**: `rounded-md`, `rounded-xl` (conflicting border radius)
- **Impact**: Cards show rounded corners despite theme setting

### 2. Shadow Implementation

- **CSS Variables**: All shadows set to `0% opacity` (completely disabled)
- **Component Classes**: `shadow-xs`, `shadow-sm` applied but invisible
- **Impact**: Flat appearance, no depth perception

### 3. Font Stack Uniformity

- **All font variants**: Use `Geist Mono, monospace`
- **Impact**: No typographic hierarchy, very technical aesthetic

## Comparison Framework for tweakcn Reference

### Elements Requiring Reference Values

#### 1. Shadow System

```css
/* CURRENT (disabled) */
--shadow-sm:
  0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0);

/* EXPECTED tweakcn equivalent */
--shadow-sm: [NEED REFERENCE VALUES];
```

#### 2. Border Radius Consistency

```css
/* CURRENT */
--radius: 0rem;

/* EXPECTED tweakcn verification */
--radius: [NEED REFERENCE VALUE];
```

#### 3. Color Accuracy

```css
/* CURRENT primary */
--primary: oklch(0.5555 0 0);

/* EXPECTED tweakcn primary */
--primary: [NEED REFERENCE VALUE];
```

#### 4. Typography Specification

```css
/* CURRENT (all same) */
--font-sans: Geist Mono, monospace;
--font-serif: Geist Mono, monospace;
--font-mono: Geist Mono, monospace;

/* EXPECTED tweakcn specification */
--font-sans: [NEED REFERENCE];
--font-serif: [NEED REFERENCE];
--font-mono: [NEED REFERENCE];
```

## Component-Specific Analysis Required

### Button States

- **Default hover**: `hover:bg-primary/90` (90% opacity)
- **Outline hover**: `hover:bg-accent hover:text-accent-foreground`
- **Focus states**: Ring-based with 3px ring width

### Card Layout

- **Padding**: `py-6` (24px vertical), `px-6` (24px horizontal)
- **Gap**: `gap-6` (24px between sections)
- **Border**: Standard 1px solid border

### Input Elements

- **Background**: Uses `--input` variable
- **Border**: Uses `--border` variable
- **Focus**: Uses `--ring` with opacity adjustments

## Testing Requirements

### Visual Comparison Checklist

- [ ] Button variants in both light/dark modes
- [ ] Card components with content
- [ ] Form elements (inputs, selects, textareas)
- [ ] Navigation/sidebar elements
- [ ] Typography samples (headings, body text, code)
- [ ] Shadow depth examples
- [ ] Border radius consistency
- [ ] Focus state treatments

### Technical Validation Needed

- [ ] CSS custom property values from tweakcn
- [ ] Component class definitions from tweakcn
- [ ] Accessibility compliance verification
- [ ] Cross-browser rendering consistency
- [ ] Dark mode transition behaviors

## Next Steps for Complete Audit

1. **Obtain tweakcn MonoGeist reference**
   - CSS custom property values
   - Component styling specifications
   - Official design tokens

2. **Screenshot comparison matrix**
   - Current implementation vs tweakcn reference
   - Light mode vs dark mode
   - All major UI components

3. **Technical specifications alignment**
   - Shadow system implementation
   - Border radius consistency
   - Typography hierarchy
   - Color palette accuracy

4. **Component-level auditing**
   - Button variants and states
   - Card layouts and spacing
   - Form element styling
   - Navigation components

---

**Status**: Baseline audit complete. Requires tweakcn reference access to complete comparison matrix and identify discrepancies.
