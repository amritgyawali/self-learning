'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar as CalendarIcon, Clock, Users, Camera, Video, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  type: 'wedding' | 'pre-wedding' | 'engagement' | 'other'
  date: string
  startTime: string
  endTime: string
  location: string
  client: string
  team: string[]
  equipment: string[]
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Anderson Wedding',
    type: 'wedding',
    date: '2024-02-15',
    startTime: '14:00',
    endTime: '22:00',
    location: 'Grand Plaza Hotel',
    client: 'James & Emily Anderson',
    team: ['John Smith', 'Sarah Johnson', 'Mike Wilson'],
    equipment: ['Canon EOS R5', 'RF 70-200mm f/2.8', 'Lighting Kit A'],
    status: 'upcoming',
    notes: 'Traditional ceremony followed by reception'
  },
  {
    id: '2',
    title: 'Thompson Pre-Wedding',
    type: 'pre-wedding',
    date: '2024-02-10',
    startTime: '09:00',
    endTime: '15:00',
    location: 'Botanical Gardens',
    client: 'David & Lisa Thompson',
    team: ['Sarah Johnson', 'Alex Brown'],
    equipment: ['Sony A7 IV', 'Drone Kit'],
    status: 'completed'
  }
]

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('February 2024')

  const eventTypes = ['All', 'wedding', 'pre-wedding', 'engagement', 'other']
  const statuses = ['All', 'upcoming', 'in-progress', 'completed', 'cancelled']
  const months = ['January 2024', 'February 2024', 'March 2024', 'April 2024']

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All' || event.type === selectedType
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-500'
      case 'in-progress': return 'text-yellow-500'
      case 'completed': return 'text-green-500'
      case 'cancelled': return 'text-red-500'
      default: return ''
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'wedding': return <Camera className="h-4 w-4" />
      case 'pre-wedding': return <Camera className="h-4 w-4" />
      case 'engagement': return <Camera className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Event Calendar</h2>
          <p className="text-muted-foreground">
            Schedule and manage photography events
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
            </DialogHeader>
            {/* Add event form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid would go here */}
      {/* For now, showing events in list view */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.client}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Team</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      {event.team.join(', ')}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Equipment</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Camera className="h-4 w-4" />
                      {event.equipment.join(', ')}
                    </div>
                  </div>
                </div>

                {event.notes && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{event.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}