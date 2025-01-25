'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { LayoutDashboard, ImageIcon, FileVideo, Settings, Users, MessageSquare, BarChart, Bell, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: ImageIcon, label: 'Photos', href: '/admin/dashboard/photos' },
    { icon: FileVideo, label: 'Videos', href: '/admin/dashboard/videos' },
    { icon: Users, label: 'Users', href: '/admin/dashboard/users' },
    { icon: MessageSquare, label: 'Comments', href: '/admin/dashboard/comments' },
    { icon: BarChart, label: 'Analytics', href: '/admin/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
  ]

  return (
    <div className={`min-h-screen`}>
      <SidebarProvider>
        {/* <div className="flex h-screen bg-gray-100 dark:bg-gray-900"> */}
          <Sidebar>
            <SidebarHeader className="p-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">Admin</span>
              </Link>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center space-x-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="w-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        {/* </div> */}
      </SidebarProvider>
    </div>
  )
}

