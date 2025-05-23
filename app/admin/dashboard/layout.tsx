'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { LayoutDashboard, ImageIcon, FileVideo, Settings, Users, User, MessageSquare, BarChart, Bell, Sun, Moon, Calendar, FileText, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const menuItems = [
    // Dashboard & Analytics
    { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
    { icon: BarChart, label: 'Analytics', href: '/admin/dashboard/analytics' },
    
    // Photography Management
    { icon: ImageIcon, label: 'Photos', href: '/admin/dashboard/photos' },
    { icon: ImageIcon, label: 'Photo Customization', href: '/admin/dashboard/photo-customization' },
    { icon: ImageIcon, label: 'AI Photo Management', href: '/admin/dashboard/ai-photo-management' },
    { icon: ImageIcon, label: 'Guest Photos', href: '/admin/dashboard/photos/guest-photos' },
    { icon: FileVideo, label: 'Videos', href: '/admin/dashboard/videos' },
    
    // Business Management
    { icon: Calendar, label: 'Bookings', href: '/admin/dashboard/bookings' },
    { icon: Users, label: 'Client Management', href: '/admin/dashboard/client-management' },
    { icon: User, label: 'Customer Details', href: '/admin/dashboard/customer-details' },
    { icon: Users, label: 'Staff', href: '/admin/dashboard/staff' },
    { icon: Settings, label: 'Equipment', href: '/admin/dashboard/equipment-management' },
    { icon: Settings, label: 'Packages', href: '/admin/dashboard/packages' },
    { icon: FileText, label: 'Custom Quotation', href: '/admin/dashboard/custom-quotation' },
    
    // Communication & Tasks
    { icon: BarChart, label: 'Agile Board', href: '/admin/dashboard/agile-board' },
    { icon: MessageSquare, label: 'Comments', href: '/admin/dashboard/comments' },
    { icon: Bell, label: 'Notifications', href: '/admin/dashboard/notifications' },
    
    // System
    { icon: Users, label: 'Users', href: '/admin/dashboard/users' },
    { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Mobile Sidebar - Shown when mobile menu is open */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileMenu}></div>
        )}
        
        {/* Sidebar */}
        <div 
          className={`${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} lg:relative lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                {/* Hamburger Menu Button - Only visible on mobile */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 lg:hidden" 
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? 
                    <X className="h-6 w-6" /> : 
                    <Menu className="h-6 w-6" />
                  }
                </Button>
                <h1 className="text-xl md:text-2xl font-semibold">
                  {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
            <SpeedInsights />
            <Analytics />
          </main>
        </div>
      </div>
    </div>
  )
}
