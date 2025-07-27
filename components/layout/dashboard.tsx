"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar"
import { ThemeSelect } from '@/components/custom/ThemeSelect'
import { Separator } from '@/components/ui/separator'

interface DashboardLayoutProps {
  children?: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Main Dashboard Layout Component
 * Uses CSS Grid for proper min-height and overflow handling following shadcn patterns
 */
export function DashboardLayout({ 
  children, 
  sidebar, 
  header, 
  footer, 
  className 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div 
        className={cn(
          "grid min-h-screen w-full overflow-hidden",
          "grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]",
          "md:grid-cols-[auto_1fr]",
          className
        )}
      >
        {/* Sidebar - spans full height */}
        <div className="row-span-full">
          <DashboardSidebar>
            {sidebar}
          </DashboardSidebar>
        </div>

        {/* Main content area with header, main, and footer */}
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen overflow-hidden">
          {/* Header */}
          <DashboardHeader>
            {header}
          </DashboardHeader>

          {/* Main content */}
          <DashboardMain>
            {children}
          </DashboardMain>

          {/* Footer */}
          <DashboardFooter>
            {footer}
          </DashboardFooter>
        </div>
      </div>
    </SidebarProvider>
  )
}

/**
 * Dashboard Sidebar Component
 * Wraps the shadcn Sidebar with default styling
 */
function DashboardSidebar({ 
  children, 
  className 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <Sidebar className={cn("border-r", className)}>
      <SidebarContent className="overflow-y-auto">
        {children || (
          <>
            <SidebarHeader className="px-4 py-2">
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </SidebarHeader>
            <div className="flex-1 px-4 py-2">
              <p className="text-sm text-muted-foreground">Sidebar content</p>
            </div>
            <SidebarFooter className="px-4 py-2">
              <p className="text-xs text-muted-foreground">Footer</p>
            </SidebarFooter>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

/**
 * Dashboard Header Component
 * Contains Menubar, ThemeSelect, and Switch
 */
function DashboardHeader({ 
  children, 
  className 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <SidebarInset>
      <header 
        className={cn(
          "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "flex h-14 items-center justify-between px-4 py-2",
          className
        )}
      >
        {children || (
          <>
            {/* Left side - Sidebar trigger and Menubar */}
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <DashboardMenubar />
            </div>

            {/* Right side - Theme controls */}
            <div className="flex items-center gap-2">
              <ThemeSelect />
            </div>
          </>
        )}
      </header>
    </SidebarInset>
  )
}

/**
 * Dashboard Main Content Component
 * Scrollable main content area
 */
function DashboardMain({ 
  children, 
  className 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <SidebarInset>
      <main 
        className={cn(
          "flex-1 overflow-y-auto p-4",
          "min-h-0", // Important for grid overflow handling
          className
        )}
      >
        {children || (
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Main Content</h1>
            <p className="text-muted-foreground">
              This is the main content area of the dashboard.
            </p>
          </div>
        )}
      </main>
    </SidebarInset>
  )
}

/**
 * Dashboard Footer Component
 */
function DashboardFooter({ 
  children, 
  className 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <SidebarInset>
      <footer 
        className={cn(
          "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "flex h-12 items-center justify-center px-4 py-2",
          className
        )}
      >
        {children || (
          <p className="text-xs text-muted-foreground">
            © 2024 Dashboard. All rights reserved.
          </p>
        )}
      </footer>
    </SidebarInset>
  )
}

/**
 * Default Menubar for Dashboard Header
 */
function DashboardMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarItem>Reset</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

// Export individual components for flexibility
export {
  DashboardSidebar,
  DashboardHeader,
  DashboardMain,
  DashboardFooter,
  DashboardMenubar,
}
