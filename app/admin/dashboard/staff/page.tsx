'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Star, Calendar, Phone, Mail } from 'lucide-react'
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

interface StaffMember {
  id: string
  name: string
  role: string
  specialization: string[]
  experience: number
  rating: number
  availability: 'available' | 'booked' | 'off'
  phone: string
  email: string
  skills: string[]
  completedEvents: number
  nextEvent?: string
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Lead Photographer',
    specialization: ['Wedding', 'Portrait', 'Pre-Wedding'],
    experience: 8,
    rating: 4.8,
    availability: 'available',
    phone: '+1 (234) 567-8901',
    email: 'john.smith@example.com',
    skills: ['Composition', 'Lighting', 'Post-Processing'],
    completedEvents: 250
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Videographer',
    specialization: ['Cinematic', 'Documentary'],
    experience: 6,
    rating: 4.7,
    availability: 'booked',
    phone: '+1 (345) 678-9012',
    email: 'sarah.j@example.com',
    skills: ['Editing', 'Drone Operation', 'Sound Recording'],
    completedEvents: 180,
    nextEvent: '2024-02-15: Anderson Wedding'
  }
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedAvailability, setSelectedAvailability] = useState('All')

  const roles = ['All', 'Photographer', 'Videographer', 'Assistant', 'Editor']
  const availabilityOptions = ['All', 'available', 'booked', 'off']

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'All' || member.role.includes(selectedRole)
    const matchesAvailability = selectedAvailability === 'All' || member.availability === selectedAvailability
    return matchesSearch && matchesRole && matchesAvailability
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-500'
      case 'booked': return 'text-blue-500'
      case 'off': return 'text-red-500'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">
            Manage your photography and videography team
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            {/* Add staff form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid gap-4">
        {filteredStaff.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <span className={`text-sm font-medium ${getAvailabilityColor(member.availability)}`}>
                        {member.availability.charAt(0).toUpperCase() + member.availability.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Contact</Label>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience & Rating</Label>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">{member.experience} years</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{member.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Specialization</Label>
                    <div className="flex flex-wrap gap-1">
                      {member.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Events</Label>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">{member.completedEvents} completed</p>
                      {member.nextEvent && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {member.nextEvent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}