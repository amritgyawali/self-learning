'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Check, 
  Clock, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings, 
  AlertTriangle,
  Trash2, 
  RefreshCw,
  CheckCircle2,
  X,
  ChevronDown,
  Search
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define notification types
type NotificationType = 'system' | 'client' | 'task' | 'alert'
type NotificationPriority = 'low' | 'medium' | 'high'
type NotificationStatus = 'unread' | 'read' | 'archived'

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  timestamp: string
  actionUrl?: string
  actionLabel?: string
  sender?: {
    name: string
    avatar?: string
  }
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Booking Request',
    message: 'John & Sarah Smith have requested a booking for June 15, 2024.',
    type: 'client',
    priority: 'high',
    status: 'unread',
    timestamp: '2024-02-15T09:30:00',
    actionUrl: '/admin/dashboard/bookings',
    actionLabel: 'View Booking',
    sender: {
      name: 'Booking System',
      avatar: '/images/logo.png'
    }
  },
  {
    id: '2',
    title: 'Equipment Maintenance Due',
    message: 'Your Canon EOS R5 is due for sensor cleaning this week.',
    type: 'system',
    priority: 'medium',
    status: 'unread',
    timestamp: '2024-02-14T16:45:00',
    actionUrl: '/admin/dashboard/equipment-management',
    actionLabel: 'View Equipment'
  },
  {
    id: '3',
    title: 'Client Gallery Viewed',
    message: 'Michael & Emma Johnson viewed their wedding gallery 5 times in the last 24 hours.',
    type: 'client',
    priority: 'low',
    status: 'read',
    timestamp: '2024-02-14T11:20:00',
    actionUrl: '/admin/dashboard/client-management',
    actionLabel: 'View Client',
    sender: {
      name: 'Gallery System',
      avatar: '/images/gallery-1.jpg'
    }
  },
  {
    id: '4',
    title: 'Task Assigned to You',
    message: 'Edit wedding photos for David & Lisa Thompson by February 20.',
    type: 'task',
    priority: 'high',
    status: 'unread',
    timestamp: '2024-02-13T14:15:00',
    actionUrl: '/admin/dashboard/agile-board',
    actionLabel: 'View Task',
    sender: {
      name: 'Alex Johnson',
      avatar: '/avatar.jpg'
    }
  },
  {
    id: '5',
    title: 'Storage Space Alert',
    message: 'Your cloud storage is at 85% capacity. Consider upgrading or cleaning up old files.',
    type: 'alert',
    priority: 'medium',
    status: 'read',
    timestamp: '2024-02-12T08:30:00',
    actionUrl: '/admin/dashboard/settings',
    actionLabel: 'Manage Storage'
  },
  {
    id: '6',
    title: 'New Comments on Photos',
    message: 'The Smiths left 3 new comments on their wedding photos.',
    type: 'client',
    priority: 'medium',
    status: 'read',
    timestamp: '2024-02-11T19:45:00',
    actionUrl: '/admin/dashboard/comments',
    actionLabel: 'View Comments',
    sender: {
      name: 'Comment System',
      avatar: '/images/couple-image.jpg'
    }
  },
  {
    id: '7',
    title: 'Staff Meeting Reminder',
    message: 'Weekly team meeting tomorrow at 10:00 AM.',
    type: 'system',
    priority: 'medium',
    status: 'unread',
    timestamp: '2024-02-10T15:00:00',
    actionUrl: '/admin/dashboard/calendar',
    actionLabel: 'View Calendar'
  },
  {
    id: '8',
    title: 'Payment Received',
    message: 'Received final payment of $1,500 from Michael & Emma Johnson.',
    type: 'client',
    priority: 'high',
    status: 'read',
    timestamp: '2024-02-09T11:30:00',
    actionUrl: '/admin/dashboard/client-management',
    actionLabel: 'View Client',
    sender: {
      name: 'Payment System',
      avatar: '/images/logo.png'
    }
  },
  {
    id: '9',
    title: 'System Update Available',
    message: 'A new version of the admin dashboard is available. Update now for new features.',
    type: 'system',
    priority: 'low',
    status: 'read',
    timestamp: '2024-02-08T09:15:00',
    actionUrl: '/admin/dashboard/settings',
    actionLabel: 'Update System'
  },
  {
    id: '10',
    title: 'Low Disk Space Warning',
    message: 'Your editing workstation is running low on disk space (15% remaining).',
    type: 'alert',
    priority: 'high',
    status: 'unread',
    timestamp: '2024-02-07T16:20:00',
    actionUrl: '/admin/dashboard/settings',
    actionLabel: 'Manage Storage'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    soundAlerts: true,
    desktopNotifications: true,
    autoArchiveRead: false,
    showUnreadFirst: true
  })

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.status === 'unread').length

  // Apply filters and search
  useEffect(() => {
    let filtered = [...notifications]
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType)
    }
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === filterPriority)
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(n => n.status === filterStatus)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query)
      )
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'unread') {
        filtered = filtered.filter(n => n.status === 'unread')
      } else if (activeTab === 'archived') {
        filtered = filtered.filter(n => n.status === 'archived')
      } else {
        filtered = filtered.filter(n => n.type === activeTab)
      }
    }
    
    // Sort by timestamp (newest first) and unread status if preference is set
    filtered.sort((a, b) => {
      if (preferences.showUnreadFirst) {
        if (a.status === 'unread' && b.status !== 'unread') return -1
        if (a.status !== 'unread' && b.status === 'unread') return 1
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    
    setFilteredNotifications(filtered)
  }, [notifications, activeTab, searchQuery, filterType, filterPriority, filterStatus, preferences.showUnreadFirst])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, status: 'read' } : n
      )
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => 
        n.status === 'unread' ? { ...n, status: 'read' } : n
      )
    )
  }

  // Archive notification
  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, status: 'archived' } : n
      )
    )
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Handle preference change
  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'system': return <Settings className="h-5 w-5" />
      case 'client': return <Users className="h-5 w-5" />
      case 'task': return <Calendar className="h-5 w-5" />
      case 'alert': return <AlertTriangle className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  // Get color for priority
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view all your system notifications in one place.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <Label className="text-xs font-medium">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <Label className="text-xs font-medium">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <Label className="text-xs font-medium">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search notifications..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Unread ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="system" className="text-xs">
                      System
                    </TabsTrigger>
                    <TabsTrigger value="client" className="text-xs">
                      Client
                    </TabsTrigger>
                    <TabsTrigger value="task" className="text-xs">
                      Tasks
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="mt-4 space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 rounded-lg border ${notification.status === 'unread' ? 'bg-muted/50 dark:bg-muted/20' : 'bg-card'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{notification.title}</h4>
                                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {notification.status === 'unread' && (
                                    <Badge variant="secondary" className="text-xs">
                                      New
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {formatRelativeTime(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                              
                              {notification.sender && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                    <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">
                                    From: {notification.sender.name}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                {notification.actionUrl && (
                                  <Button variant="link" size="sm" className="h-8 px-0">
                                    {notification.actionLabel || 'View Details'}
                                  </Button>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  {notification.status === 'unread' && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8" 
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8" 
                                    onClick={() => archiveNotification(notification.id)}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive" 
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No notifications found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchQuery ? 'Try adjusting your search or filters' : 'You\'re all caught up!'}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="flex-1">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications" className="flex-1">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications" className="flex-1">SMS Notifications</Label>
                <Switch
                  id="smsNotifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="soundAlerts" className="flex-1">Sound Alerts</Label>
                <Switch
                  id="soundAlerts"
                  checked={preferences.soundAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('soundAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="desktopNotifications" className="flex-1">Desktop Notifications</Label>
                <Switch
                  id="desktopNotifications"
                  checked={preferences.desktopNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('desktopNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoArchiveRead" className="flex-1">Auto-Archive Read Notifications</Label>
                <Switch
                  id="autoArchiveRead"
                  checked={preferences.autoArchiveRead}
                  onCheckedChange={(checked) => handlePreferenceChange('autoArchiveRead', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showUnreadFirst" className="flex-1">Show Unread First</Label>
                <Switch
                  id="showUnreadFirst"
                  checked={preferences.showUnreadFirst}
                  onCheckedChange={(checked) => handlePreferenceChange('showUnreadFirst', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Notifications</span>
                <span className="font-medium">{notifications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unread</span>
                <span className="font-medium">{notifications.filter(n => n.status === 'unread').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Read</span>
                <span className="font-medium">{notifications.filter(n => n.status === 'read').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Archived</span>
                <span className="font-medium">{notifications.filter(n => n.status === 'archived').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High Priority</span>
                <span className="font-medium">{notifications.filter(n => n.priority === 'high').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}