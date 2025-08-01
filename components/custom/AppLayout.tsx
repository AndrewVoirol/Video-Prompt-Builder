"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSelect } from "@/components/custom/ThemeSelect";
import { HomeIcon, SettingsIcon, FileTextIcon, ImageIcon } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Main application layout with responsive sidebar
 *
 * Features:
 * - Desktop: Static sidebar (hidden on md breakpoint and below)
 * - Mobile: Drawer/Sheet triggered by hamburger menu
 * - Automatic focus trap and body scroll lock (handled by shadcn Sheet)
 * - Reuses the same Sidebar content for both desktop and mobile
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <FileTextIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Video Prompt Builder</span>
                <span className="text-xs text-sidebar-foreground/60">
                  AI-powered prompts
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="#home">
                        <HomeIcon />
                        <span>Home</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#builder">
                        <FileTextIcon />
                        <span>Builder</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#gallery">
                        <ImageIcon />
                        <span>Gallery</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#settings">
                        <SettingsIcon />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          {/* Header with hamburger menu for mobile */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-between">
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">
                  🎬 Video Prompt Builder
                </h1>
              </div>
              <div className="md:hidden">
                <h1 className="text-lg font-semibold">
                  🎬 Video Prompt Builder
                </h1>
              </div>
              <ThemeSelect />
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
