# UI Library Audit

## Present Components

### Shadcn Components (6 total)
- `components/ui/button.tsx` - Fully featured button with variants (default, destructive, outline, secondary, ghost, link) and sizes
- `components/ui/badge.tsx` - Badge component with variants (default, secondary, destructive, outline)
- `components/ui/card.tsx` - Complete card component with Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- `components/ui/input.tsx` - Input component with focus states and validation styling
- `components/ui/select.tsx` - Complete select component with Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, etc.
- `components/ui/tabs.tsx` - Tab component with Tabs, TabsList, TabsTrigger, TabsContent

### Locally Hand-Rolled Components (19 total)
- `components/Alert.tsx` - Custom alert component
- `components/Badge.tsx` - Custom badge with color variants (primary, secondary, success, warning, error, info, neutral)
- `components/Button.tsx` - **Re-exports ShadCN button** (not a duplicate implementation)
- `components/EnhancedPromptForm.tsx` - App-specific form component
- `components/ErrorBoundary.tsx` - Error handling component
- `components/Field.tsx` - Form field wrapper
- `components/Fieldset.tsx` - Fieldset wrapper
- `components/Layout.tsx` - App layout component
- `components/Nav.tsx` - Navigation component
- `components/OutputCard.tsx` - App-specific output display
- `components/OutputPanel.tsx` - App-specific panel component
- `components/PromptBuilder.tsx` - Main app component
- `components/ProvenanceBadge.tsx` - Specialized badge component
- `components/Skeleton.tsx` - Loading skeleton component
- `components/StaticBadge.tsx` - Static badge variant
- `components/Tab.tsx` - Custom tab component (potential overlap with shadcn tabs)
- `components/theme-provider.tsx` - React 19/Next.js 15 optimized theme provider
- `components/ThemeProvider.tsx` - Alternative theme provider implementation
- `components/ThemeToggle.tsx` - Theme switching component
- `components/Toast.tsx` - Toast notification component

## Configuration Analysis

### components.json Status ✅
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,        ✅ RSC enabled
  "tsx": true,        ✅ TypeScript enabled
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""       ✅ No prefix
  },
  "aliases": {
    "components": "@/components",  ✅ Correct alias
    "utils": "@/lib/utils"        ✅ Correct alias
  }
}
```

### Tailwind Configuration ✅
- CSS variables properly configured in `app/globals.css`
- Dark mode support with class-based switching
- ShadCN color palette correctly implemented
- `tailwindcss-animate` plugin installed

### Dependencies Status ✅
- `@radix-ui/react-*` primitives installed
- `class-variance-authority` for variant handling
- `clsx` and `tailwind-merge` for className utilities
- `lucide-react` for icons
- `next-themes` for theme switching

## Overlaps and Potential Conflicts

### Major Overlaps
1. **Badge Components**:
   - `components/Badge.tsx` - Custom implementation with 7 color variants
   - `components/ui/badge.tsx` - ShadCN implementation with 4 variants
   - **Impact**: Different APIs, potential styling inconsistencies

2. **Theme Providers**:
   - `components/theme-provider.tsx` - React 19/Next.js 15 optimized
   - `components/ThemeProvider.tsx` - Alternative implementation
   - **Impact**: Two different configurations, potential conflicts

3. **Tab Components**:
   - `components/Tab.tsx` - Custom tab implementation
   - `components/ui/tabs.tsx` - ShadCN tabs with Radix UI
   - **Impact**: Potential API differences

### Minor Overlaps
- `components/Skeleton.tsx` - Custom skeleton (ShadCN skeleton not yet installed)
- `components/Toast.tsx` - Custom toast (ShadCN toast/sonner not yet installed)

## Recommended Actions

### High Priority
1. **Resolve Badge Conflict**:
   - Option A: Migrate to ShadCN badge, extend with missing color variants
   - Option B: Keep custom badge, remove ShadCN badge
   - **Recommendation**: Migrate to ShadCN and extend with additional variants

2. **Consolidate Theme Providers**:
   - Choose one theme provider implementation
   - **Recommendation**: Keep `components/theme-provider.tsx` (React 19 optimized)
   - **Action**: Delete `components/ThemeProvider.tsx`

3. **Resolve Tab Conflict**:
   - Audit usage of custom `Tab.tsx` vs ShadCN `tabs.tsx`
   - **Recommendation**: Migrate to ShadCN tabs for consistency

### Medium Priority
4. **Consider ShadCN Additions**:
   - Install ShadCN skeleton to replace custom implementation
   - Install ShadCN toast/sonner for notifications
   - Install ShadCN alert/alert-dialog if needed

### Files to Delete After Migration
- `components/ThemeProvider.tsx` (after choosing theme provider)
- `components/Badge.tsx` (if migrating to ShadCN badge)
- `components/Tab.tsx` (if migrating to ShadCN tabs)
- `components/Skeleton.tsx` (after installing ShadCN skeleton)

## Next Steps
1. Install remaining ShadCN components based on requirements
2. Migrate overlapping components to ShadCN versions
3. Update imports throughout codebase
4. Test for visual/functional regressions
5. Remove unused component files
