'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, Users, Calendar, DollarSign, ImageIcon, 
  FileVideo, Sparkles, BarChart2, Settings, Wrench,
  Clock, Bell, MessageSquare, ChevronRight, Zap,
  ArrowUpRight, ArrowDownRight, RefreshCw, Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Mock data - Replace with real API calls
const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 16000 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 25000 },
  { month: 'Jul', revenue: 28000 },
]

const bookingData = [
  { month: 'Jan', bookings: 5 },
  { month: 'Feb', bookings: 8 },
  { month: 'Mar', bookings: 12 },
  { month: 'Apr', bookings: 15 },
  { month: 'May', bookings: 25 },
  { month: 'Jun', bookings: 35 },
  { month: 'Jul', bookings: 30 },
]

const packageData = [
  { name: 'Premium', value: 45 },
  { name: 'Standard', value: 30 },
  { name: 'Basic', value: 15 },
  { name: 'Custom', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const upcomingEvents = [
  {
    id: '1',
    title: 'Johnson Wedding',
    date: '2024-06-15',
    time: '14:00 - 22:00',
    location: 'Grand Plaza Hotel',
    client: 'John & Sarah Johnson',
    type: 'wedding',
    team: ['Mike Wilson', 'Emma Clark'],
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Thompson Engagement',
    date: '2024-06-10',
    time: '16:00 - 19:00',
    location: 'Sunset Beach',
    client: 'David & Lisa Thompson',
    type: 'engagement',
    team: ['Emma Clark'],
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Williams Family Session',
    date: '2024-06-18',
    time: '10:00 - 12:00',
    location: 'City Park',
    client: 'Williams Family',
    type: 'family',
    team: ['Mike Wilson'],
    status: 'pending'
  }
]

const recentClients = [
  {
    id: '1',
    name: 'John & Sarah Johnson',
    email: 'john.sarah@example.com',
    status: 'active',
    lastContact: '2024-05-28',
    upcomingEvent: 'Wedding (2024-06-15)',
    avatar: '/images/couple-image.jpg'
  },
  {
    id: '2',
    name: 'David & Lisa Thompson',
    email: 'david.lisa@example.com',
    status: 'lead',
    lastContact: '2024-05-25',
    upcomingEvent: 'Engagement (2024-06-10)',
    avatar: '/images/gallery-2.jpg'
  },
  {
    id: '3',
    name: 'Williams Family',
    email: 'williams@example.com',
    status: 'active',
    lastContact: '2024-05-20',
    upcomingEvent: 'Family Session (2024-06-18)'
  }
]

const maintenanceAlerts = [
  {
    id: '1',
    equipment: 'Canon EOS R5',
    issue: 'Scheduled maintenance due',
    dueDate: '2024-06-05',
    priority: 'medium'
  },
  {
    id: '2',
    equipment: 'Profoto B10 Plus',
    issue: 'Battery replacement needed',
    dueDate: '2024-06-01',
    priority: 'high'
  }
]

const aiInsights = [
  {
    id: '1',
    title: 'Client Booking Pattern',
    description: 'Bookings increase 40% when you respond within 2 hours',
    type: 'booking'
  },
  {
    id: '2',
    title: 'Popular Photo Style',
    description: 'Candid photos receive 3x more client engagement',
    type: 'photo'
  },
  {
    id: '3',
    title: 'Revenue Opportunity',
    description: 'Adding drone footage could increase package value by 25%',
    type: 'revenue'
  }
]

export default function IntegratedDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$145,250',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Bookings',
      value: '125',
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'Active Clients',
      value: '48',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Equipment Status',
      value: '95%',
      change: '-2.1%',
      trend: 'down',
      icon: Camera,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Wedding Photography Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your photography business
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Business Performance</CardTitle>
            <CardDescription>Revenue and bookings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bookings" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="packages" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {packageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/dashboard/advanced-analytics">
              <Button variant="link" className="p-0 h-auto font-normal text-primary flex items-center">
                View detailed analytics
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Insights
            </CardTitle>
            <CardDescription>Smart recommendations for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {insight.type === 'booking' ? (
                        <Calendar className="h-4 w-4 text-primary" />
                      ) : insight.type === 'photo' ? (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/dashboard/ai-photo-management">
              <Button variant="link" className="p-0 h-auto font-normal text-primary flex items-center">
                Explore AI photo management
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your schedule for the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="p-2 rounded-md bg-primary/10 text-center min-w-[50px]">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <Badge variant={event.status === 'confirmed' ? 'default' : 'outline'}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.time}</span>
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.client}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/dashboard/calendar">
              <Button variant="link" className="p-0 h-auto font-normal text-primary flex items-center">
                View full calendar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>Latest client interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Avatar>
                    {client.avatar ? (
                      <AvatarImage src={client.avatar} alt={client.name} />
                    ) : (
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{client.name}</h4>
                      <Badge variant="outline" className="capitalize">
                        {client.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last contact: {client.lastContact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/dashboard/client-management">
              <Button variant="link" className="p-0 h-auto font-normal text-primary flex items-center">
                Manage all clients
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Equipment & Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Maintenance alerts and equipment health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Overall Equipment Health</h4>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-3">Maintenance Alerts</h4>
                {maintenanceAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className={`p-1.5 rounded-full ${
                      alert.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <Wrench className={`h-3.5 w-3.5 ${
                        alert.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{alert.equipment}</p>
                      <p className="text-xs text-muted-foreground">{alert.issue}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        alert.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                      }`}>Due: {alert.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/dashboard/equipment-management">
              <Button variant="link" className="p-0 h-auto font-normal text-primary flex items-center">
                Manage equipment
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used tools and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/admin/dashboard/client-management">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">Client Management</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/dashboard/calendar">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">Calendar</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/dashboard/ai-photo-management">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Sparkles className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">AI Photo Tools</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/dashboard/advanced-analytics">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <BarChart2 className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">Analytics</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/dashboard/equipment-management">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Camera className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">Equipment</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/dashboard/settings">
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Settings className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-sm font-medium">Settings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}