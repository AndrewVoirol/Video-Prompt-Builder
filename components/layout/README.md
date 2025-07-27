# Dashboard Layout

A flexible dashboard layout component built with shadcn/ui components, using CSS Grid for proper min-height and overflow handling.

## Features

- ✅ **CSS Grid Layout**: Uses CSS Grid for responsive and proper min-height handling
- ✅ **Shadcn Sidebar Integration**: Built on top of the shadcn sidebar component
- ✅ **Overflow Handling**: Proper scrolling behavior for main content area
- ✅ **Theme Support**: Integrated with ThemeSelect and theme switching
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Customizable Slots**: Sidebar, Header, Main, and Footer are all customizable

## Components

### DashboardLayout

The main layout component that provides the grid structure and slots for different areas.

```tsx
import { DashboardLayout } from "@/components/layout/dashboard"

export default function MyDashboard() {
  return (
    <DashboardLayout
      sidebar={<MySidebar />}
      header={<MyHeader />}
      footer={<MyFooter />}
    >
      <div>Main content here</div>
    </DashboardLayout>
  )
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Main content area |
| `sidebar` | `React.ReactNode` | Custom sidebar content |
| `header` | `React.ReactNode` | Custom header content |
| `footer` | `React.ReactNode` | Custom footer content |
| `className` | `string` | Additional CSS classes |

## Grid Structure

The layout uses CSS Grid with the following structure:

```css
.dashboard-grid {
  display: grid;
  min-height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
}
```

- **Sidebar**: Spans full height on the left
- **Header**: Fixed height at the top of the content area
- **Main**: Flexible height, scrollable content
- **Footer**: Fixed height at the bottom of the content area

## Default Components

If no custom content is provided, the layout includes sensible defaults:

### Default Sidebar
- Dashboard title
- Placeholder content
- Footer with version info

### Default Header
- Sidebar toggle button
- Default menubar (File, Edit, View)
- ThemeSelect component with dark/light toggle

### Default Footer
- Copyright notice

## Customization Examples

### Custom Sidebar with Navigation

```tsx
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Settings, Users } from "lucide-react"

function CustomSidebar() {
  return (
    <>
      <SidebarHeader>
        <h2>My App</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/users">
                <Users className="h-4 w-4" />
                Users
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}
```

### Custom Header with User Info

```tsx
function CustomHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-lg font-medium">Welcome, John!</h1>
      </div>
      <div className="flex items-center gap-4">
        <UserAvatar />
        <ThemeSelect />
      </div>
    </div>
  )
}
```

### Custom Footer with Links

```tsx
function CustomFooter() {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-xs text-muted-foreground">
        © 2024 My Company
      </p>
      <div className="flex gap-4 text-xs">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </div>
    </div>
  )
}
```

## CSS Grid Benefits

The CSS Grid approach provides several advantages:

1. **Proper Height Handling**: The grid ensures the layout takes full viewport height
2. **Overflow Control**: Main content area scrolls independently
3. **Responsive**: Grid adjusts automatically on different screen sizes
4. **No JavaScript**: Pure CSS solution for layout
5. **Flexible**: Easy to modify grid areas as needed

## Mobile Responsiveness

The layout automatically adapts to mobile screens using the shadcn sidebar's built-in mobile behavior:

- Sidebar becomes a slide-out drawer on mobile
- Header remains sticky and accessible
- Main content area maintains proper scrolling

## Example Usage

See `dashboard-example.tsx` for a complete working example with:
- Custom sidebar navigation
- Dashboard metrics cards
- Activity feed
- Custom header and footer

## Dependencies

- `@/components/ui/sidebar` - Shadcn sidebar components
- `@/components/ui/menubar` - Shadcn menubar components
- `@/components/custom/ThemeSelect` - Theme selection component
- `@/lib/utils` - Utility functions (cn)
- `lucide-react` - Icons

## File Structure

```
components/layout/
├── dashboard.tsx          # Main dashboard layout component
├── dashboard-example.tsx  # Example usage and customization
└── README.md             # This documentation
```
