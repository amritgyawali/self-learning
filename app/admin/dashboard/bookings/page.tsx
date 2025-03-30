'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, Clock, MessageSquare, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - Replace with real API calls
const bookings = [
  {
    id: 'B001',
    customerName: 'John & Sarah',
    date: '2024-06-15',
    package: 'Premium Wedding Package',
    status: 'Confirmed',
    phone: '+1234567890',
    email: 'john@example.com',
    amount: 2500,
    advancePaid: true,
    assignedStaff: ['Mike', 'Emma'],
    requirements: 'Traditional ceremony + Reception'
  },
  // Add more mock bookings...
]

const agileColumns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100' }
]

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Booking Request',
      message: 'New wedding booking request from Alex & Emma',
      time: '5 minutes ago',
      type: 'new'
    },
    // Add more notifications...
  ])

  const handleSendSMS = async (phone: string, message: string) => {
    // Integrate with SMS API (e.g., Twilio)
    console.log('Sending SMS to:', phone, message)
  }

  const handleSendEmail = async (email: string, subject: string, message: string) => {
    // Integrate with Email API
    console.log('Sending email to:', email, subject, message)
  }

  const handleNotifyStaff = async (booking: any) => {
    // Send notifications to assigned staff
    booking.assignedStaff.forEach((staff: string) => {
      console.log('Notifying staff member:', staff)
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Manage all wedding photography bookings</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white">
          <Bell className="mr-2 h-4 w-4" />
          Notifications ({notifications.length})
        </Button>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="agile">Agile Board</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.package}</TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.status === 'Confirmed' ? 'success' : 'warning'}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${booking.amount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendSMS(booking.phone, 'Booking reminder')}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(booking.email, 'Booking Update', 'Your booking details...')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNotifyStaff(booking)}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agile" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {agileColumns.map((column) => (
              <Card key={column.id} className={`${column.color}`}>
                <CardHeader>
                  <CardTitle>{column.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Agile cards will be rendered here */}
                  {bookings
                    .filter((booking) => booking.status === column.title)
                    .map((booking) => (
                      <Card key={booking.id} className="mb-4 cursor-pointer hover:shadow-md">
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{booking.customerName}</h4>
                          <p className="text-sm text-gray-500">{booking.date}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            {booking.assignedStaff.map((staff) => (
                              <Badge key={staff} variant="outline">{staff}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 p-4 border-b last:border-0"
                >
                  {notification.type === 'new' ? (
                    <AlertCircle className="h-6 w-6 text-blue-500" />
                  ) : notification.type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}