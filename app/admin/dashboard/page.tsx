'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ImageIcon, FileVideo, Users, Eye, ArrowUp, ArrowDown,
  Calendar, Clock, TrendingUp, Activity, RefreshCcw, Sparkles, Palette, Settings, LayoutDashboard,
  Bell, CheckCircle2, AlertCircle, BellRing, MessageSquare, PieChart, BarChart2, ListChecks, Trello,
  PanelLeft, PanelRight, Maximize, Minimize, Bookmark, Star, Zap, Briefcase, DollarSign, Layers,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data - Replace with real API calls
const visitorData = [
  { name: 'Mon', visitors: 400, pageViews: 600, conversions: 12 },
  { name: 'Tue', visitors: 300, pageViews: 450, conversions: 8 },
  { name: 'Wed', visitors: 500, pageViews: 750, conversions: 15 },
  { name: 'Thu', visitors: 280, pageViews: 420, conversions: 7 },
  { name: 'Fri', visitors: 590, pageViews: 885, conversions: 20 },
  { name: 'Sat', visitors: 350, pageViews: 525, conversions: 11 },
  { name: 'Sun', visitors: 480, pageViews: 720, conversions: 14 },
]

// Weather data for outdoor shoot planning
const weatherData = [
  { day: 'Today', temp: 72, condition: 'Sunny', icon: 'sun', precipitation: 0 },
  { day: 'Tomorrow', temp: 68, condition: 'Partly Cloudy', icon: 'cloud-sun', precipitation: 10 },
  { day: 'Wed', temp: 65, condition: 'Cloudy', icon: 'cloud', precipitation: 20 },
  { day: 'Thu', temp: 70, condition: 'Sunny', icon: 'sun', precipitation: 0 },
  { day: 'Fri', temp: 75, condition: 'Sunny', icon: 'sun', precipitation: 0 },
]

// AI insights data
const aiInsights = [
  { id: 1, title: 'Optimal Posting Time', description: 'Based on engagement patterns, posting new photos between 7-9 PM on Thursdays generates 35% more engagement.', icon: 'clock', category: 'engagement' },
  { id: 2, title: 'Popular Photo Styles', description: 'Candid outdoor shots are receiving 42% more likes than posed indoor photos in the last 30 days.', icon: 'image', category: 'content' },
  { id: 3, title: 'Client Booking Patterns', description: 'Couples aged 25-34 are most likely to book premium packages when first contacted within 24 hours.', icon: 'users', category: 'sales' },
  { id: 4, title: 'Equipment Recommendation', description: 'Based on your recent shoots, upgrading to the Sony 85mm f/1.4 lens would improve your low-light wedding photos.', icon: 'camera', category: 'equipment' },
]

const engagementData = [
  { name: 'Photos', value: 65 },
  { name: 'Videos', value: 45 },
  { name: 'Comments', value: 85 },
  { name: 'Bookings', value: 75 },
]

const statsData = [
  {
    title: "Total Photos",
    value: "2,345",
    description: "Professional photos uploaded",
    icon: ImageIcon,
    change: "+12%",
    trend: "up",
    progress: 78
  },
  {
    title: "Total Videos",
    value: "145",
    description: "Wedding videos uploaded",
    icon: FileVideo,
    change: "+8%",
    trend: "up",
    progress: 65
  },
  {
    title: "Total Visitors",
    value: "12,454",
    description: "Unique visitors this month",
    icon: Users,
    change: "-3%",
    trend: "down",
    progress: 82
  },
  {
    title: "Page Views",
    value: "45,235",
    description: "Total page views this month",
    icon: Eye,
    change: "+24%",
    trend: "up",
    progress: 92
  }
]

const recentActivity = [
  {
    icon: ImageIcon,
    title: "New Wedding Album",
    description: "Wedding photos from John & Sarah's ceremony uploaded",
    time: "2 minutes ago",
    color: "text-blue-500"
  },
  {
    icon: Calendar,
    title: "New Booking",
    description: "Wedding photography booking for June 15th",
    time: "1 hour ago",
    color: "text-green-500"
  },
  {
    icon: FileVideo,
    title: "Video Processing Complete",
    description: "Wedding highlight video ready for review",
    time: "3 hours ago",
    color: "text-purple-500"
  },
  {
    icon: Activity,
    title: "High Traffic Alert",
    description: "Unusual traffic spike detected on gallery page",
    time: "5 hours ago",
    color: "text-orange-500"
  }
]

// Additional mock data for new features
const taskData = [
  { id: 1, title: "Review wedding photos", status: "pending", priority: "high", dueDate: "2024-06-10", assignee: "John Doe" },
  { id: 2, title: "Send client invoice", status: "completed", priority: "medium", dueDate: "2024-06-05", assignee: "Jane Smith" },
  { id: 3, title: "Schedule engagement shoot", status: "in-progress", priority: "high", dueDate: "2024-06-12", assignee: "John Doe" },
  { id: 4, title: "Order new equipment", status: "pending", priority: "low", dueDate: "2024-06-20", assignee: "Jane Smith" },
  { id: 5, title: "Update portfolio website", status: "in-progress", priority: "medium", dueDate: "2024-06-15", assignee: "John Doe" },
]

const notificationData = [
  { id: 1, title: "New booking request", description: "Wedding booking request from Emily & Michael", time: "5 minutes ago", read: false, type: "booking" },
  { id: 2, title: "Payment received", description: "$1,500 payment received from Johnson wedding", time: "2 hours ago", read: false, type: "payment" },
  { id: 3, title: "System update", description: "New system update available for installation", time: "1 day ago", read: true, type: "system" },
  { id: 4, title: "Low storage warning", description: "Storage capacity reaching 90%", time: "2 days ago", read: true, type: "alert" },
]

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const packageData = [
  { name: 'Premium', value: 45 },
  { name: 'Standard', value: 30 },
  { name: 'Basic', value: 15 },
  { name: 'Custom', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [layoutMode, setLayoutMode] = useState<'default' | 'compact' | 'expanded'>('default')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(notificationData)
  const [unreadCount, setUnreadCount] = useState(() => notificationData.filter(n => !n.read).length)
  const [tasks, setTasks] = useState(taskData)
  const [newTask, setNewTask] = useState('')
  const [dashboardTab, setDashboardTab] = useState('overview')
  const [customizeMode, setCustomizeMode] = useState(false)
  const [showTaskPanel, setShowTaskPanel] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof taskData[0] | null>(null)
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [showFinancialMetrics, setShowFinancialMetrics] = useState(true)
  const [dateRange, setDateRange] = useState('This Month')
  const [forecastPeriod, setForecastPeriod] = useState('3 months')
  const [systemHealth, setSystemHealth] = useState({
    storage: 78,
    cpu: 45,
    memory: 62,
    network: 85
  })
  const [dashboardLayout, setDashboardLayout] = useState([
    'stats', 'charts', 'activity', 'tasks', 'financial', 'clients', 'actions'
  ])

  // Ensure time is only set on client side
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString())
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return
    
    const task = {
      id: tasks.length + 1,
      title: newTask,
      status: 'pending',
      priority: taskPriority,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      assignee: taskAssignee || 'Unassigned'
    }
    
    setTasks([...tasks, task])
    setNewTask('')
    setTaskPriority('medium')
    setTaskDueDate('')
    setTaskAssignee('')
  }

  // Update task status
  const updateTaskStatus = (id: number, status: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ))
  }

  // Toggle dashboard layout mode
  const toggleLayoutMode = () => {
    if (layoutMode === 'default') setLayoutMode('compact')
    else if (layoutMode === 'compact') setLayoutMode('expanded')
    else setLayoutMode('default')
  }

  // Drag and drop functionality for dashboard layout
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  
  const handleDragStart = (index: number) => {
    dragItem.current = index
  }
  
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newItems = [...dashboardLayout]
      const draggedItem = newItems[dragItem.current]
      newItems.splice(dragItem.current, 1)
      newItems.splice(dragOverItem.current, 0, draggedItem)
      setDashboardLayout(newItems)
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  return (
<div className="space-y-8">
      {/* Header with Tabs, Notifications and Settings */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              {/* Only render time if it's set on client side */}
              {currentTime ? `Last updated: ${currentTime}` : 'Loading...'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <DropdownMenuItem key={notification.id} className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-accent/50' : ''}`}>
                        <div className="flex items-start w-full">
                          <div className={`p-2 rounded-full mr-2 ${notification.type === 'booking' ? 'bg-green-100 text-green-600' : notification.type === 'payment' ? 'bg-blue-100 text-blue-600' : notification.type === 'system' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                            {notification.type === 'booking' ? <Calendar className="h-4 w-4" /> : 
                             notification.type === 'payment' ? <DollarSign className="h-4 w-4" /> : 
                             notification.type === 'system' ? <Settings className="h-4 w-4" /> : 
                             <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin/dashboard/notifications" className="w-full text-center text-sm text-primary">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleLayoutMode}>
                  {layoutMode === 'default' ? <PanelLeft className="mr-2 h-4 w-4" /> : 
                   layoutMode === 'compact' ? <PanelRight className="mr-2 h-4 w-4" /> : 
                   <Maximize className="mr-2 h-4 w-4" />}
                  {layoutMode === 'default' ? 'Compact View' : 
                   layoutMode === 'compact' ? 'Expanded View' : 'Default View'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCustomizeMode(!customizeMode)}>
                  <Palette className="mr-2 h-4 w-4" />
                  {customizeMode ? 'Exit Customize Mode' : 'Customize Dashboard'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFinancialMetrics(!showFinancialMetrics)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  {showFinancialMetrics ? 'Hide Financial Metrics' : 'Show Financial Metrics'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Advanced Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs value={dashboardTab} onValueChange={setDashboardTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <ListChecks className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={dashboardTab} onValueChange={setDashboardTab}>
        <TabsContent value="overview" className="mt-6">
        {/* Customizable Dashboard Layout */}
        {customizeMode && (
          <Card className="mb-6 border-dashed border-2 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Dashboard Customization Mode
              </CardTitle>
              <CardDescription>
                Drag and drop widgets to customize your dashboard layout. Click and hold a widget to move it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dashboardLayout.map((widget, index) => (
                  <Badge 
                    key={widget} 
                    variant="outline" 
                    className="py-2 px-3 cursor-move flex items-center"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {widget === 'stats' && <BarChart2 className="h-3 w-3 mr-1" />}
                    {widget === 'charts' && <PieChart className="h-3 w-3 mr-1" />}
                    {widget === 'activity' && <Activity className="h-3 w-3 mr-1" />}
                    {widget === 'tasks' && <ListChecks className="h-3 w-3 mr-1" />}
                    {widget === 'financial' && <DollarSign className="h-3 w-3 mr-1" />}
                    {widget === 'clients' && <Users className="h-3 w-3 mr-1" />}
                    {widget === 'actions' && <Zap className="h-3 w-3 mr-1" />}
                    {widget.charAt(0).toUpperCase() + widget.slice(1)}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCustomizeMode(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setCustomizeMode(false)}
                >
                  Save Layout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  <div className="mt-3">
                    <Progress value={stat.progress} className="h-1" />
                  </div>
                  <div className={`flex items-center text-xs mt-2 ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Visitor Analytics</CardTitle>
              <CardDescription>Daily visitor and page view statistics</CardDescription>
            </div>
            <Select defaultValue="7days">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)' 
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Page Views"
                    stroke="var(--secondary)"
                    fillOpacity={1}
                    fill="url(#colorPageViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Content engagement breakdown</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Chart Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Bar Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PieChart className="h-4 w-4 mr-2" />
                  Pie Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Line Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)' 
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Metrics */}
      {showFinancialMetrics && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Revenue and package distribution</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="Last Month">Last Month</SelectItem>
                  <SelectItem value="This Quarter">This Quarter</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Forecast" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 Month Forecast</SelectItem>
                  <SelectItem value="6 months">6 Month Forecast</SelectItem>
                  <SelectItem value="12 months">12 Month Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Revenue Trend</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          border: '1px solid var(--border)' 
                        }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--primary)" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Package Distribution</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={packageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {packageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          border: '1px solid var(--border)' 
                        }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Total Revenue</p>
                      <h3 className="text-2xl font-bold">$24,500</h3>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary opacity-70" />
                  </div>
                  <div className="flex items-center mt-2 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+12.5%</span>
                    <span className="ml-1 text-muted-foreground">from last {dateRange.toLowerCase()}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Avg. Booking Value</p>
                      <h3 className="text-2xl font-bold">$2,850</h3>
                    </div>
                    <Briefcase className="h-8 w-8 text-primary opacity-70" />
                  </div>
                  <div className="flex items-center mt-2 text-xs">
                    <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+5.2%</span>
                    <span className="ml-1 text-muted-foreground">from last {dateRange.toLowerCase()}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Projected Revenue</p>
                      <h3 className="text-2xl font-bold">$32,700</h3>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary opacity-70" />
                  </div>
                  <div className="flex items-center mt-2 text-xs">
                    <span className="text-muted-foreground">Next {forecastPeriod} forecast</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Server and resource monitoring</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refreshData()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Storage</p>
                <Badge variant={systemHealth.storage > 90 ? "destructive" : systemHealth.storage > 70 ? "warning" : "outline"}>
                  {systemHealth.storage}%
                </Badge>
              </div>
              <Progress value={systemHealth.storage} className="h-2" />
              <p className="text-xs text-muted-foreground">22.5 GB used of 30 GB</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">CPU Usage</p>
                <Badge variant={systemHealth.cpu > 90 ? "destructive" : systemHealth.cpu > 70 ? "warning" : "outline"}>
                  {systemHealth.cpu}%
                </Badge>
              </div>
              <Progress value={systemHealth.cpu} className="h-2" />
              <p className="text-xs text-muted-foreground">Server load normal</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Memory</p>
                <Badge variant={systemHealth.memory > 90 ? "destructive" : systemHealth.memory > 70 ? "warning" : "outline"}>
                  {systemHealth.memory}%
                </Badge>
              </div>
              <Progress value={systemHealth.memory} className="h-2" />
              <p className="text-xs text-muted-foreground">4.8 GB used of 8 GB</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Network</p>
                <Badge variant={systemHealth.network > 90 ? "destructive" : systemHealth.network > 70 ? "warning" : "outline"}>
                  {systemHealth.network}%
                </Badge>
              </div>
              <Progress value={systemHealth.network} className="h-2" />
              <p className="text-xs text-muted-foreground">85 Mbps current throughput</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time updates and system alerts</CardDescription>
            </div>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="uploads">Uploads</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="alerts">System Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 hover:bg-accent/50 p-3 rounded-lg transition-colors cursor-pointer group"
                onClick={() => console.log('View details:', activity)}
              >
                <div className={`p-2 rounded-full bg-primary/10 group-hover:bg-primary/20`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </CardFooter>
      </Card>

      {/* Task Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Track and manage your photography tasks</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowTaskPanel(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                All
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Pending
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                In Progress
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Completed
              </Badge>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-lg border ${task.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900' : task.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900' : 'bg-background border-border'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        checked={task.status === 'completed'} 
                        onCheckedChange={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                      />
                      <div>
                        <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'} className="text-xs">
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                          <span className="text-xs text-muted-foreground">Assignee: {task.assignee}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'pending')}>Mark as Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'in-progress')}>Mark as In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'completed')}>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedTask(task)}>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/agile-board">
              <Trello className="h-4 w-4 mr-2" />
              View Agile Board
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            View All Tasks
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              <FileVideo className="mr-2 h-4 w-4" />
              Upload Videos
            </Button>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 h-24 flex-col" asChild>
              <Link href="/admin/dashboard/ai-photo-management">
                <Sparkles className="mb-2 h-6 w-6" />
                AI Photo Tools
                <span className="text-xs font-normal mt-1">Batch editing & tagging</span>
              </Link>
            </Button>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 h-24 flex-col" asChild>
              <Link href="/admin/dashboard/analytics">
                <BarChart2 className="mb-2 h-6 w-6" />
                Advanced Analytics
                <span className="text-xs font-normal mt-1">Business insights</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Panel */}
      <Sheet open={showTaskPanel} onOpenChange={setShowTaskPanel}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
            <SheetDescription>
              Create a new task for your photography workflow.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title" 
                placeholder="Enter task title" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={taskPriority} onValueChange={(value: any) => setTaskPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input 
                id="task-assignee" 
                placeholder="Enter assignee name" 
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input 
                id="task-due-date" 
                type="date" 
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowTaskPanel(false)}>Cancel</Button>
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </SheetContent>
      </Sheet>
    </TabsContent>

    <TabsContent value="analytics" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>View detailed analytics for your photography business</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Link href="/admin/dashboard/analytics" className="flex flex-col items-center">
            <BarChart2 className="h-10 w-10 mb-2 text-primary" />
            <Button>Go to Analytics Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="tasks" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Manage your photography workflow tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Link href="/admin/dashboard/agile-board" className="flex flex-col items-center">
            <Trello className="h-10 w-10 mb-2 text-primary" />
            <Button>Go to Agile Board</Button>
          </Link>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="clients" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <CardDescription>Manage your photography clients</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Link href="/admin/dashboard/client-management" className="flex flex-col items-center">
            <Users className="h-10 w-10 mb-2 text-primary" />
            <Button>Go to Client Management</Button>
          </Link>
        </CardContent>
      </Card>
    </TabsContent>
    </Tabs>
  </div>
  )
}
