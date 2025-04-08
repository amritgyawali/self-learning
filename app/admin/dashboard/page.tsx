'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ImageIcon, FileVideo, Users, Eye, ArrowUp, ArrowDown,
  Calendar, Clock, TrendingUp, Activity, RefreshCcw, Sparkles, Palette, Settings, LayoutDashboard
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  { name: 'Mon', visitors: 400, pageViews: 600 },
  { name: 'Tue', visitors: 300, pageViews: 450 },
  { name: 'Wed', visitors: 500, pageViews: 750 },
  { name: 'Thu', visitors: 280, pageViews: 420 },
  { name: 'Fri', visitors: 590, pageViews: 885 },
  { name: 'Sat', visitors: 350, pageViews: 525 },
  { name: 'Sun', visitors: 480, pageViews: 720 },
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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

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

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            {/* Only render time if it's set on client side */}
            {currentTime ? `Last updated: ${currentTime}` : 'Loading...'}
          </p>
        </div>
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
          <CardHeader>
            <CardTitle>Visitor Analytics</CardTitle>
            <CardDescription>Daily visitor and page view statistics</CardDescription>
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
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Content engagement breakdown</CardDescription>
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
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
