"use client"

import { DashboardLayout } from "./dashboard"
import { SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Settings, Users, FileText } from "lucide-react"

/**
 * Example usage of the Dashboard Layout
 * This demonstrates how to customize each slot of the dashboard
 */
export function DashboardExample() {
  return (
    <DashboardLayout
      sidebar={<CustomSidebar />}
      header={<CustomHeader />}
      footer={<CustomFooter />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Active Sessions</h3>
            <p className="text-2xl font-bold">456</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Revenue</h3>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Growth</h3>
            <p className="text-2xl font-bold">+12%</p>
          </div>
        </div>
        
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
              <span>User John Doe signed up</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
              <span>New order #1234 received</span>
              <span className="text-sm text-muted-foreground">3 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
              <span>System backup completed</span>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CustomSidebar() {
  return (
    <>
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-2">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </SidebarFooter>
    </>
  )
}

function CustomHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">Welcome back!</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Last login: 2 hours ago</span>
      </div>
    </div>
  )
}

function CustomFooter() {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-xs text-muted-foreground">
        © 2024 Your Company. All rights reserved.
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="hover:text-foreground">Privacy</a>
        <a href="#" className="hover:text-foreground">Terms</a>
        <a href="#" className="hover:text-foreground">Support</a>
      </div>
    </div>
  )
}
