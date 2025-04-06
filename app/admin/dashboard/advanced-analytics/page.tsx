'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, Users, Calendar, 
  Camera, Video, Clock, ArrowUpRight, ArrowDownRight,
  Download, Filter, RefreshCw, PieChart, BarChart as BarChartIcon,
  LineChart as LineChartIcon, Map, Target, Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Mock data - Replace with real API calls in production
const revenueData = [
  { month: 'Jan', revenue: 12500, expenses: 5200, profit: 7300 },
  { month: 'Feb', revenue: 15000, expenses: 5800, profit: 9200 },
  { month: 'Mar', revenue: 18000, expenses: 6500, profit: 11500 },
  { month: 'Apr', revenue: 16000, expenses: 6000, profit: 10000 },
  { month: 'May', revenue: 21000, expenses: 7200, profit: 13800 },
  { month: 'Jun', revenue: 25000, expenses: 8500, profit: 16500 },
  { month: 'Jul', revenue: 28000, expenses: 9200, profit: 18800 },
  { month: 'Aug', revenue: 30000, expenses: 9800, profit: 20200 },
  { month: 'Sep', revenue: 26000, expenses: 8900, profit: 17100 },
  { month: 'Oct', revenue: 22000, expenses: 7800, profit: 14200 },
  { month: 'Nov', revenue: 19000, expenses: 7000, profit: 12000 },
  { month: 'Dec', revenue: 24000, expenses: 8200, profit: 15800 },
]

const packageData = [
  { name: 'Premium', value: 45, revenue: 112500 },
  { name: 'Standard', value: 30, revenue: 45000 },
  { name: 'Basic', value: 15, revenue: 15000 },
  { name: 'Custom', value: 10, revenue: 25000 },
]

const bookingSourceData = [
  { name: 'Website', value: 40 },
  { name: 'Referrals', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Wedding Fairs', value: 10 },
  { name: 'Other', value: 5 },
]

const clientDemographicsData = [
  { age: '18-24', value: 10 },
  { age: '25-34', value: 45 },
  { age: '35-44', value: 30 },
  { age: '45-54', value: 10 },
  { age: '55+', value: 5 },
]

const seasonalTrendsData = [
  { month: 'Jan', bookings: 5 },
  { month: 'Feb', bookings: 8 },
  { month: 'Mar', bookings: 12 },
  { month: 'Apr', bookings: 15 },
  { month: 'May', bookings: 25 },
  { month: 'Jun', bookings: 35 },
  { month: 'Jul', bookings: 30 },
  { month: 'Aug', bookings: 28 },
  { month: 'Sep', bookings: 22 },
  { month: 'Oct', bookings: 18 },
  { month: 'Nov', bookings: 10 },
  { month: 'Dec', bookings: 7 },
]

const locationData = [
  { city: 'New York', bookings: 35, revenue: 87500 },
  { city: 'Los Angeles', bookings: 28, revenue: 70000 },
  { city: 'Chicago', bookings: 20, revenue: 50000 },
  { city: 'Miami', bookings: 15, revenue: 37500 },
  { city: 'Dallas', bookings: 12, revenue: 30000 },
  { city: 'Other', bookings: 40, revenue: 100000 },
]

const performanceMetricsData = [
  { name: 'Client Satisfaction', value: 92 },
  { name: 'On-time Delivery', value: 95 },
  { name: 'Rebooking Rate', value: 68 },
  { name: 'Referral Rate', value: 72 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('year')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0)
  const totalBookings = seasonalTrendsData.reduce((sum, item) => sum + item.bookings, 0)
  
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Net Profit',
      value: `$${totalProfit.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
    },
    {
      title: 'Avg. Booking Value',
      value: `$${Math.round(totalRevenue / totalBookings).toLocaleString()}`,
      change: '+5.7%',
      trend: 'up',
      icon: DollarSign,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights for your wedding photography business
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
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
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
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
      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full grid-cols-5 md:w-auto">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="profit" stroke="#82ca9d" fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Package Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Package Distribution</CardTitle>
                <CardDescription>Revenue by package type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height="70%">
                    <RechartsPieChart>
                      <Pie
                        data={packageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {packageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {packageData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-xs">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">${item.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Seasonal Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Seasonal Booking Trends</CardTitle>
                <CardDescription>Monthly booking distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonalTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Booking Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Sources</CardTitle>
                <CardDescription>Where your clients come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height="70%">
                    <RechartsPieChart>
                      <Pie
                        data={bookingSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {bookingSourceData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-xs">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">{item.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Client Demographics</CardTitle>
                <CardDescription>Age distribution of your clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientDemographicsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="age" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Percentage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Client Retention */}
            <Card>
              <CardHeader>
                <CardTitle>Client Retention & Growth</CardTitle>
                <CardDescription>New vs returning clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', new: 8, returning: 2 },
                        { month: 'Feb', new: 10, returning: 3 },
                        { month: 'Mar', new: 12, returning: 5 },
                        { month: 'Apr', new: 15, returning: 6 },
                        { month: 'May', new: 18, returning: 8 },
                        { month: 'Jun', new: 20, returning: 10 },
                        { month: 'Jul', new: 18, returning: 12 },
                        { month: 'Aug', new: 16, returning: 14 },
                        { month: 'Sep', new: 14, returning: 12 },
                        { month: 'Oct', new: 12, returning: 10 },
                        { month: 'Nov', new: 10, returning: 8 },
                        { month: 'Dec', new: 8, returning: 6 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="#8884d8" name="New Clients" />
                      <Line type="monotone" dataKey="returning" stroke="#82ca9d" name="Returning Clients" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Bookings and revenue by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                      <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Key Performance Metrics</CardTitle>
                <CardDescription>Quality and satisfaction indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceMetricsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Bar dataKey="value" fill="#8884d8" name="Score (%)">
                        {performanceMetricsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Cards */}
            <div className="space-y-6">
              {performanceMetricsData.map((metric, index) => (
                <Card key={metric.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                        <h3 className="text-2xl font-bold mt-1">{metric.value}%</h3>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                      >
                        <Award className="h-6 w-6" style={{ color: COLORS[index % COLORS.length] }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}