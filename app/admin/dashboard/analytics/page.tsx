'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, Clock, Camera, Video, 
  Calendar, ArrowUpRight, ArrowDownRight,
  Download, Share2, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock data - Replace with real API calls
const visitorsData = [
  { date: '2024-01-22', visitors: 120, pageViews: 350 },
  { date: '2024-01-23', visitors: 150, pageViews: 420 },
  { date: '2024-01-24', visitors: 180, pageViews: 500 },
  { date: '2024-01-25', visitors: 200, pageViews: 580 },
  { date: '2024-01-26', visitors: 250, pageViews: 600 },
  { date: '2024-01-27', visitors: 280, pageViews: 750 },
  { date: '2024-01-28', visitors: 310, pageViews: 800 },
]

const contentData = [
  { name: 'Photos', value: 450 },
  { name: 'Videos', value: 120 },
  { name: 'Albums', value: 65 },
  { name: 'Events', value: 30 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const stats = [
    {
      title: 'Total Visitors',
      value: '1,490',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Avg. Session Duration',
      value: '4m 32s',
      change: '+5.2%',
      trend: 'up',
      icon: Clock,
    },
    {
      title: 'Photos Viewed',
      value: '8,230',
      change: '-3.1%',
      trend: 'down',
      icon: Camera,
    },
    {
      title: 'Videos Played',
      value: '2,845',
      change: '+18.7%',
      trend: 'up',
      icon: Video,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Track your website's performance and user engagement
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
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

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Analytics</CardTitle>
            <CardDescription>Daily visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={visitorsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#0088FE"
                    fillOpacity={1}
                    fill="url(#visitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#00C49F"
                    fillOpacity={1}
                    fill="url(#pageViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Breakdown of content types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Insights
        </Button>
      </div>
    </div>
  )
}