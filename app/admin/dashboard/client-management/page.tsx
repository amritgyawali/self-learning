'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Search, Plus, Mail, Phone, MessageSquare, 
  Calendar, Clock, Heart, Star, Filter, MoreHorizontal,
  UserPlus, FileText, Send, Bell, Download, Upload,
  DollarSign, Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'lead' | 'active' | 'completed' | 'archived'
  source: string
  dateAdded: string
  upcomingEvent?: {
    title: string
    date: string
    location: string
  }
  lastContact?: string
  notes: string
  tags: string[]
  avatar?: string
  communicationPreferences: {
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
  history: {
    date: string
    type: 'email' | 'call' | 'meeting' | 'payment' | 'contract' | 'other'
    description: string
  }[]
  feedback?: {
    rating: number
    comment: string
    date: string
  }
}

// Mock data - Replace with real API calls
const mockClients: Client[] = [
  {
    id: '1',
    name: 'John & Sarah Smith',
    email: 'john.sarah@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    source: 'Website Inquiry',
    dateAdded: '2024-01-15',
    upcomingEvent: {
      title: 'Wedding Photography',
      date: '2024-06-15',
      location: 'Grand Plaza Hotel'
    },
    lastContact: '2024-01-28',
    notes: 'Looking for full day coverage with second shooter. Interested in premium album package.',
    tags: ['premium', 'full-day', 'album'],
    avatar: '/images/couple-image.jpg',
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: false
    },
    history: [
      {
        date: '2024-01-15',
        type: 'email',
        description: 'Initial inquiry received'
      },
      {
        date: '2024-01-18',
        type: 'call',
        description: 'Discovery call - discussed packages and availability'
      },
      {
        date: '2024-01-25',
        type: 'meeting',
        description: 'In-person consultation - showed sample albums'
      },
      {
        date: '2024-01-28',
        type: 'payment',
        description: 'Booking deposit received - $500'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael & Emma Johnson',
    email: 'michael.emma@example.com',
    phone: '+1 (555) 987-6543',
    status: 'lead',
    source: 'Referral',
    dateAdded: '2024-01-20',
    lastContact: '2024-01-22',
    notes: 'Referred by the Smiths. Interested in engagement session + wedding day coverage.',
    tags: ['referral', 'engagement'],
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: true
    },
    history: [
      {
        date: '2024-01-20',
        type: 'email',
        description: 'Initial inquiry received'
      },
      {
        date: '2024-01-22',
        type: 'call',
        description: 'Brief phone call - scheduled consultation for next week'
      }
    ]
  },
  {
    id: '3',
    name: 'David & Lisa Thompson',
    email: 'david.lisa@example.com',
    phone: '+1 (555) 456-7890',
    status: 'completed',
    source: 'Instagram',
    dateAdded: '2023-08-10',
    notes: 'Destination wedding in Bali. Very happy with the photos.',
    tags: ['destination', 'international', 'premium'],
    avatar: '/images/gallery-2.jpg',
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true
    },
    history: [
      {
        date: '2023-08-10',
        type: 'email',
        description: 'Initial inquiry received'
      },
      {
        date: '2023-08-15',
        type: 'meeting',
        description: 'Virtual consultation'
      },
      {
        date: '2023-08-20',
        type: 'payment',
        description: 'Booking deposit received - $1000'
      },
      {
        date: '2023-12-05',
        type: 'other',
        description: 'Wedding day coverage completed'
      },
      {
        date: '2024-01-10',
        type: 'email',
        description: 'Final gallery delivered'
      }
    ],
    feedback: {
      rating: 5,
      comment: 'Absolutely amazing! The photos captured our special day perfectly. Highly recommend!',
      date: '2024-01-15'
    }
  }
];

// Email templates for automated communication
const emailTemplates = [
  {
    id: '1',
    name: 'Initial Inquiry Response',
    subject: 'Thank you for your inquiry!',
    body: 'Dear {client_name},\n\nThank you for reaching out about your wedding photography needs. I\'m excited to learn more about your special day!\n\n I\'d love to schedule a time to chat about your vision and how we can capture your perfect moments.\n\nBest regards,\n{your_name}'
  },
  {
    id: '2',
    name: 'Booking Confirmation',
    subject: 'Your wedding photography is confirmed!',
    body: 'Dear {client_name},\n\n I\'m thrilled to confirm your booking for {event_date} at {event_location}!\n\nI\'ve attached your contract and receipt for your deposit payment. Please let me know if you have any questions.\n\nI\'m looking forward to capturing your special day!\n\nBest regards,\n{your_name}'
  },
  {
    id: '3',
    name: 'Pre-Wedding Checklist',
    subject: 'Getting ready for your big day!',
    body: 'Dear {client_name},\n\nYour wedding day is approaching, and I\'m excited to be part of it! Here\'s a quick checklist to help us prepare:\n\n1. Finalize the shot list\n2. Confirm the timeline\n3. Share any special photo requests\n\nPlease let me know if you have any questions or concerns.\n\nBest regards,\n{your_name}'
  },
  {
    id: '4',
    name: 'Gallery Delivery',
    subject: 'Your wedding photos are ready!',
    body: 'Dear {client_name},\n\nI\'m excited to share that your wedding photos are now ready! You can access your online gallery using the link below:\n\n{gallery_link}\n\nThe gallery will be available for 12 months, and you can download, share, and order prints directly from the site.\n\nIt was an honor to capture your special day!\n\nBest regards,\n{your_name}'
  }
];

export default function ClientManagementPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [showAddClientDialog, setShowAddClientDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'lead' as Client['status'],
    source: 'website',
    notes: '',
    communicationPreferences: { email: true, sms: false, whatsapp: false }
  })

  // Filter clients based on search query and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    
    if (activeTab === 'all') return matchesSearch && matchesStatus
    if (activeTab === 'leads') return matchesSearch && matchesStatus && client.status === 'lead'
    if (activeTab === 'active') return matchesSearch && matchesStatus && client.status === 'active'
    if (activeTab === 'completed') return matchesSearch && matchesStatus && client.status === 'completed'
    
    return matchesSearch && matchesStatus
  })

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
  }

  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setEmailSubject(template.subject)
      setEmailBody(template.body)
    }
  }

  const handleSendEmail = async () => {
    // In production, integrate with email service
    console.log('Sending email to:', selectedClient?.email)
    console.log('Subject:', emailSubject)
    console.log('Body:', emailBody)
    
    // Add to client history
    if (selectedClient) {
      const updatedClients = clients.map(client => {
        if (client.id === selectedClient.id) {
          return {
            ...client,
            lastContact: new Date().toISOString().split('T')[0],
            history: [
              {
                date: new Date().toISOString().split('T')[0],
                type: 'email',
                description: `Email sent: ${emailSubject}`
              },
              ...client.history
            ]
          }
        }
        return client
      })
      
      setClients(updatedClients as Client[])
      setShowEmailDialog(false)
      
      // Update selected client
      const updatedClient = updatedClients.find(c => c.id === selectedClient.id)
      if (updatedClient) setSelectedClient(updatedClient as Client)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'call': return <Phone className="h-4 w-4" />
      case 'meeting': return <Users className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'contract': return <FileText className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Client Management</h2>
          <p className="text-muted-foreground">
            Manage your client relationships and communication
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the client details to add them to your database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input 
                      id="name" 
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="John & Sarah Smith" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newClient.status}
                      onValueChange={(value: 'lead' | 'active' | 'completed' | 'archived') => 
setNewClient({
  ...newClient,
status: value as 'lead' | 'active' | 'completed' | 'archived'
})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="client@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select 
                    value={newClient.source}
                    onValueChange={(value) => setNewClient({...newClient, source: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How did they find you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website Inquiry</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="wedding-fair">Wedding Fair</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    value={newClient.notes}
                    onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                    placeholder="Add any relevant information about this client..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Communication Preferences</Label>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="email-pref" 
                        checked={newClient.communicationPreferences.email}
                        onCheckedChange={(checked) => setNewClient({
                          ...newClient, 
                          communicationPreferences: {
                            ...newClient.communicationPreferences,
                            email: checked
                          }
                        })}
                      />
                      <Label htmlFor="email-pref">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="sms-pref" 
                        checked={newClient.communicationPreferences.sms}
                        onCheckedChange={(checked) => setNewClient({
                          ...newClient, 
                          communicationPreferences: {
                            ...newClient.communicationPreferences,
                            sms: checked
                          }
                        })}
                      />
                      <Label htmlFor="sms-pref">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="whatsapp-pref" 
                        checked={newClient.communicationPreferences.whatsapp}
                        onCheckedChange={(checked) => setNewClient({
                          ...newClient, 
                          communicationPreferences: {
                            ...newClient.communicationPreferences,
                            whatsapp: checked
                          }
                        })}
                      />
                      <Label htmlFor="whatsapp-pref">WhatsApp</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddClientDialog(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Create a new client with a unique ID and current date
                  const newClientWithId: Client = {
                    id: Date.now().toString(),
                    name: newClient.name,
                    email: newClient.email,
                    phone: newClient.phone,
                    status: newClient.status,
                    source: newClient.source,
                    dateAdded: new Date().toISOString().split('T')[0],
                    notes: newClient.notes,
                    tags: [],
                    communicationPreferences: newClient.communicationPreferences,
                    history: [
                      {
                        date: new Date().toISOString().split('T')[0],
                        type: 'other',
                        description: 'Client added to system'
                      }
                    ]
                  };
                  
                  // Add to clients list
                  setClients([newClientWithId, ...clients]);
                  
                  // Reset form and close dialog
                  setNewClient({
                    name: '',
                    email: '',
                    phone: '',
                    status: 'lead' as const,
                    source: 'website',
                    notes: '',
                    communicationPreferences: { email: true, sms: false, whatsapp: false }
                  });
                  setShowAddClientDialog(false);
                }}>Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-2">
                    {filteredClients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer ${selectedClient?.id === client.id ? 'border-primary' : ''}`}
                          onClick={() => handleSelectClient(client)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium">{client.name}</h3>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                              <Badge className={getStatusColor(client.status)}>
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="leads" className="mt-4">
                  <div className="space-y-2">
                    {filteredClients.filter(client => client.status === 'lead').map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer ${selectedClient?.id === client.id ? 'border-primary' : ''}`}
                          onClick={() => handleSelectClient(client)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium">{client.name}</h3>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                              <Badge className={getStatusColor(client.status)}>
                                Lead
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="active" className="mt-4">
                  <div className="space-y-2">
                    {filteredClients.filter(client => client.status === 'active').map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer ${selectedClient?.id === client.id ? 'border-primary' : ''}`}
                          onClick={() => handleSelectClient(client)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium">{client.name}</h3>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                              <Badge className={getStatusColor(client.status)}>
                                Active
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                  <div className="space-y-2">
                    {filteredClients.filter(client => client.status === 'completed').map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer ${selectedClient?.id === client.id ? 'border-primary' : ''}`}
                          onClick={() => handleSelectClient(client)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium">{client.name}</h3>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                              <Badge className={getStatusColor(client.status)}>
                                Completed
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedClient.name}</CardTitle>
                    <CardDescription>Added on {selectedClient.dateAdded}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Email to {selectedClient.name}</DialogTitle>
                          <DialogDescription>
                            Choose a template or write a custom message
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Email Template</Label>
                            <Select
                              value={selectedTemplate}
                              onValueChange={handleSelectTemplate}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent>
                                {emailTemplates.map(template => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                              rows={8}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSendEmail}>
                            Send Email
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Contract
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Meeting
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  {selectedClient.upcomingEvent && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Upcoming Event</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedClient.upcomingEvent.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedClient.upcomingEvent.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedClient.upcomingEvent.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Communication Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Communication Preferences</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedClient.communicationPreferences.email}
                          disabled
                        />
                        <Label>Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedClient.communicationPreferences.sms}
                          disabled
                        />
                        <Label>SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedClient.communicationPreferences.whatsapp}
                          disabled
                        />
                        <Label>WhatsApp</Label>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Activity History */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Activity History</h3>
                    <div className="space-y-4">
                      {selectedClient.history.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Feedback */}
                  {selectedClient.feedback && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-4 w-4 ${index < selectedClient.feedback!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <p className="text-sm">{selectedClient.feedback.comment}</p>
                            <p className="text-sm text-muted-foreground">{selectedClient.feedback.date}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Users className="mx-auto h-8 w-8 mb-4" />
                <p>Select a client to view their details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}