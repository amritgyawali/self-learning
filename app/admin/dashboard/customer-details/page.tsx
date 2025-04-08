'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, CreditCard, MessageSquare, Calendar, Clock, 
  FileText, Camera, Upload, Download, Star, 
  Edit, Trash2, CheckCircle, AlertTriangle,
  Image, Phone, Mail, Tag, Heart, ThumbsUp, ThumbsDown,
  MoreVertical, Search, Filter, ChevronRight, X, Plus,
  Users, ArrowUpDown, ChevronDown, ChevronUp, RefreshCw,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

// Define customer type
type CustomerStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'

interface CustomerRequirement {
  id: string
  description: string
  completed: boolean
}

interface CustomerCommunication {
  id: string
  date: string
  type: string
  subject: string
  content: string
  sentBy: string
}

interface CustomerPayment {
  id: string
  date: string
  amount: number
  method: string
  status: string
  description: string
  receiptImage: string
}

interface CustomerEventDayNote {
  id: string
  time: string
  note: string
  author: string
  important: boolean
}

interface CustomerPhotographerFeedback {
  overallExperience: number
  clientCooperation: number
  venueAccessibility: number
  lightingConditions: number
  timeManagement: number
  comments: string
}

interface CustomerDeliverable {
  id: string
  item: string
  status: string
  date: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  weddingDate: string
  venue: string
  package: string
  totalAmount: number
  amountPaid: number
  balance: number
  status: CustomerStatus
  assignedPhotographers: string[]
  createdAt: string
  updatedAt: string
  avatar: string
  notes: string
  tags: string[]
  requirements: CustomerRequirement[]
  communications: CustomerCommunication[]
  payments: CustomerPayment[]
  eventDayNotes: CustomerEventDayNote[]
  photographerFeedback: CustomerPhotographerFeedback
  deliverables: CustomerDeliverable[]
}

// Mock data - Replace with real API calls
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John & Sarah Smith',
    email: 'john.sarah@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Wedding Lane, Celebration City, ST 12345',
    weddingDate: '2024-06-15',
    venue: 'Grand Plaza Hotel',
    package: 'Premium Collection',
    totalAmount: 3500,
    amountPaid: 1500,
    balance: 2000,
    status: 'Confirmed',
    assignedPhotographers: ['Alex Johnson', 'Maria Garcia'],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-01',
    avatar: '/images/couple-image.jpg',
    notes: 'Looking for full day coverage with second shooter. Interested in premium album package.',
    tags: ['premium', 'full-day', 'album'],
    requirements: [
      { id: 'r1', description: 'Ceremony coverage', completed: true },
      { id: 'r2', description: 'Beach sunset photos', completed: false },
      { id: 'r3', description: 'Family formal portraits', completed: false }
    ],
    communications: [
      {
        id: 'c1',
        date: '2024-01-15',
        type: 'Email',
        subject: 'Initial Inquiry',
        content: 'Interested in wedding photography packages',
        sentBy: 'Client'
      },
      {
        id: 'c2',
        date: '2024-01-20',
        type: 'Phone',
        subject: 'Package Discussion',
        content: 'Discussed premium package details and pricing',
        sentBy: 'Staff'
      }
    ],
    payments: [
      {
        id: 'p1',
        date: '2024-01-25',
        amount: 1000,
        method: 'Credit Card',
        status: 'Completed',
        description: 'Initial deposit',
        receiptImage: '/receipts/r1.jpg'
      },
      {
        id: 'p2',
        date: '2024-02-01',
        amount: 500,
        method: 'Bank Transfer',
        status: 'Completed',
        description: 'Second installment',
        receiptImage: '/receipts/r2.jpg'
      }
    ],
    eventDayNotes: [
      {
        id: 'n1',
        time: '14:00',
        note: 'Bride preparation starts',
        author: 'Maria Garcia',
        important: true
      }
    ],
    photographerFeedback: {
      overallExperience: 5,
      clientCooperation: 5,
      venueAccessibility: 4,
      lightingConditions: 4,
      timeManagement: 5,
      comments: 'Great couple to work with, very organized'
    },
    deliverables: [
      {
        id: 'd1',
        item: 'Online Gallery',
        status: 'Pending',
        date: '2024-07-15'
      },
      {
        id: 'd2',
        item: 'Wedding Album',
        status: 'Not Started',
        date: '2024-08-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael & Emma Johnson',
    email: 'michael.emma@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Love Street, Romance Town, ST 67890',
    weddingDate: '2024-08-20',
    venue: 'Seaside Resort',
    package: 'Classic Collection',
    totalAmount: 2500,
    amountPaid: 500,
    balance: 2000,
    status: 'Pending',
    assignedPhotographers: ['Alex Johnson'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10',
    avatar: '/images/gallery-1.jpg',
    notes: 'Interested in engagement session + wedding day coverage',
    tags: ['classic', 'engagement'],
    requirements: [
      { id: 'r1', description: 'Engagement session', completed: false },
      { id: 'r2', description: 'Wedding ceremony', completed: false }
    ],
    communications: [
      {
        id: 'c1',
        date: '2024-02-01',
        type: 'Email',
        subject: 'Package Inquiry',
        content: 'Requesting information about wedding packages',
        sentBy: 'Client'
      }
    ],
    payments: [
      {
        id: 'p1',
        date: '2024-02-10',
        amount: 500,
        method: 'Credit Card',
        status: 'Completed',
        description: 'Booking deposit',
        receiptImage: '/receipts/r3.jpg'
      }
    ],
    eventDayNotes: [],
    photographerFeedback: {
      overallExperience: 0,
      clientCooperation: 0,
      venueAccessibility: 0,
      lightingConditions: 0,
      timeManagement: 0,
      comments: ''
    },
    deliverables: [
      {
        id: 'd1',
        item: 'Engagement Photos',
        status: 'Not Started',
        date: '2024-05-20'
      }
    ]
  },
  {
    id: '3',
    name: 'David & Lisa Thompson',
    email: 'david.lisa@example.com',
    phone: '+1 (555) 456-7890',
    address: '789 Forever Ave, Eternal City, ST 13579',
    weddingDate: '2023-12-10',
    venue: 'Mountain View Lodge',
    package: 'Luxury Collection',
    totalAmount: 4500,
    amountPaid: 4500,
    balance: 0,
    status: 'Completed',
    assignedPhotographers: ['Maria Garcia', 'James Wilson'],
    createdAt: '2023-06-15',
    updatedAt: '2024-01-15',
    avatar: '/images/gallery-2.jpg',
    notes: 'Winter wedding. All deliverables completed and received great feedback.',
    tags: ['luxury', 'winter', 'completed'],
    requirements: [
      { id: 'r1', description: 'Ceremony coverage', completed: true },
      { id: 'r2', description: 'Snow portraits', completed: true },
      { id: 'r3', description: 'Indoor reception', completed: true }
    ],
    communications: [
      {
        id: 'c1',
        date: '2024-01-15',
        type: 'Email',
        subject: 'Final Gallery Delivery',
        content: 'All photos delivered and approved',
        sentBy: 'Staff'
      }
    ],
    payments: [
      {
        id: 'p1',
        date: '2023-06-20',
        amount: 2000,
        method: 'Bank Transfer',
        status: 'Completed',
        description: 'Initial payment',
        receiptImage: '/receipts/r4.jpg'
      },
      {
        id: 'p2',
        date: '2023-11-01',
        amount: 2500,
        method: 'Credit Card',
        status: 'Completed',
        description: 'Final payment',
        receiptImage: '/receipts/r5.jpg'
      }
    ],
    eventDayNotes: [
      {
        id: 'n1',
        time: '13:00',
        note: 'Started with venue shots',
        author: 'Maria Garcia',
        important: false
      },
      {
        id: 'n2',
        time: '15:30',
        note: 'Beautiful snow started falling during couple portraits',
        author: 'James Wilson',
        important: true
      }
    ],
    photographerFeedback: {
      overallExperience: 5,
      clientCooperation: 5,
      venueAccessibility: 4,
      lightingConditions: 4,
      timeManagement: 5,
      comments: 'Perfect winter wedding, great lighting conditions'
    },
    deliverables: [
      {
        id: 'd1',
        item: 'Online Gallery',
        status: 'Completed',
        date: '2024-01-10'
      },
      {
        id: 'd2',
        item: 'Wedding Album',
        status: 'Completed',
        date: '2024-01-15'
      },
      {
        id: 'd3',
        item: 'USB Drive',
        status: 'Completed',
        date: '2024-01-15'
      }
    ]
  },
  {
    id: '4',
    name: 'Robert & Amy Wilson',
    email: 'robert.amy@example.com',
    phone: '+1 (555) 789-0123',
    address: '321 Dream Road, Hope City, ST 24680',
    weddingDate: '2024-05-01',
    venue: 'Garden Paradise',
    package: 'Classic Collection',
    totalAmount: 2800,
    amountPaid: 1400,
    balance: 1400,
    status: 'Cancelled',
    assignedPhotographers: ['Alex Johnson'],
    createdAt: '2023-12-01',
    updatedAt: '2024-02-01',
    avatar: '/images/gallery-3.jpg',
    notes: 'Cancelled due to change of plans. Partial refund processed.',
    tags: ['cancelled', 'refunded'],
    requirements: [
      { id: 'r1', description: 'Garden ceremony', completed: false },
      { id: 'r2', description: 'Family portraits', completed: false }
    ],
    communications: [
      {
        id: 'c1',
        date: '2024-02-01',
        type: 'Email',
        subject: 'Cancellation Notice',
        content: 'Wedding cancelled, requesting refund information',
        sentBy: 'Client'
      }
    ],
    payments: [
      {
        id: 'p1',
        date: '2023-12-05',
        amount: 1400,
        method: 'Credit Card',
        status: 'Refunded',
        description: 'Initial deposit (refunded)',
        receiptImage: '/receipts/r6.jpg'
      }
    ],
    eventDayNotes: [],
    photographerFeedback: {
      overallExperience: 0,
      clientCooperation: 0,
      venueAccessibility: 0,
      lightingConditions: 0,
      timeManagement: 0,
      comments: 'Booking cancelled'
    },
    deliverables: []
  }
]

export default function CustomerDetailsPage() {
  // Initialize all state hooks at the top level
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(mockCustomers[0]?.id ?? '')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState({ time: '', note: '', important: false })
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Lowercase<CustomerStatus>>('all')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date')

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Memoized selected customer
  const selectedCustomer = useMemo(() => {
    return customers.find(customer => customer.id === selectedCustomerId) ?? null
  }, [customers, selectedCustomerId])

  // Filter customers based on search query and status filter
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [customers, searchQuery, statusFilter])

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'date') {
        comparison = new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime()
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status)
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredCustomers, sortBy, sortOrder])

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  // Early return for no selected customer
  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="text-4xl">😕</div>
          <h2 className="text-2xl font-semibold">No Customer Selected</h2>
          <p className="text-muted-foreground">Please select a customer from the list</p>
        </div>
      </div>
    )
  }

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.time || !newNote.note) return

    setCustomers(prevCustomers => prevCustomers.map(customer => {
      if (customer.id === selectedCustomerId) {
        return {
          ...customer,
          eventDayNotes: [
            ...customer.eventDayNotes,
            {
              id: `note${customer.eventDayNotes.length + 1}`,
              ...newNote,
              author: 'Current User' // Replace with actual user name
            }
          ]
        }
      }
      return customer
    }))

    setIsAddingNote(false)
    setNewNote({ time: '', note: '', important: false })
  }

  // Handle adding a new payment
  const handleAddPayment = () => {
    // Add payment logic here
    setIsAddingPayment(false)
  }

  // Helper function to calculate payment progress
  const calculatePaymentProgress = (customer: Customer | null): number => {
    if (!customer) return 0
    return (customer.amountPaid / customer.totalAmount) * 100
  }

  // Replace useMemo with direct calculation
  const paymentProgress = calculatePaymentProgress(selectedCustomer)

  // Simulate upload progress
  const simulateUpload = async () => {
    setIsUploadingReceipt(true)
    setUploadProgress(0)
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    setIsUploadingReceipt(false)
    setUploadProgress(0)
  }

  // Handle sorting change
  const handleSortChange = (newSortBy: 'name' | 'date' | 'status') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Customer List Sidebar - Desktop */}
      <div className="hidden lg:flex flex-col w-80 border-r pr-4 h-[calc(100vh-120px)] sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Customers</h3>
          <Button size="sm" onClick={() => setIsAddingCustomer(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-3" />
          <Input 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={statusFilter} 
              onValueChange={(value: "all" | "confirmed" | "pending" | "completed" | "cancelled") => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSortChange('name')}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('status')}>
                Status {sortBy === 'status' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Customer List */}
        <ScrollArea className="flex-1">
          {sortedCustomers.map((customer) => (
            <Card 
              key={customer.id}
              className={`mb-2 cursor-pointer hover:bg-accent ${selectedCustomerId === customer.id ? 'bg-accent' : ''}`}
              onClick={() => setSelectedCustomerId(customer.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback>{customer.name.split(' ')[0][0]}{customer.name.split(' ')[2][0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{customer.name}</p>
                      <Badge variant={customer.status.toLowerCase() as any}>{customer.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(customer.weddingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="left" className="w-full sm:max-w-lg">
          {/* Add mobile filter content here */}
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Basic details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedCustomer.avatar} />
                    <AvatarFallback>{selectedCustomer.name.split(' ')[0][0]}{selectedCustomer.name.split(' ')[2][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Wedding Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(selectedCustomer.weddingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.venue}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Package</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.package}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={selectedCustomer.status.toLowerCase() as any}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Payment Progress</Label>
                  <div className="mt-2">
                    <Progress value={paymentProgress} className="h-2" />
                    <div className="flex items-center justify-between mt-1 text-sm">
                      <span>Paid: ${selectedCustomer.amountPaid}</span>
                      <span>Total: ${selectedCustomer.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    value={selectedCustomer.notes} 
                    className="mt-1" 
                    rows={4} 
                    readOnly 
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCustomer.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Communications History</CardTitle>
                  <CardDescription>Recent interactions with the customer</CardDescription>
                </div>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCustomer.communications.map((comm) => (
                    <div key={comm.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{comm.subject}</h4>
                          <Badge variant="outline">{comm.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comm.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {comm.sentBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(comm.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track all payments and invoices</CardDescription>
                </div>
                <Button onClick={() => setIsAddingPayment(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === 'Completed' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.receiptImage ? (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={simulateUpload}>
                              <Upload className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Photography Requirements</CardTitle>
                <CardDescription>Track all required shots and coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCustomer.requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {req.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span>{req.description}</span>
                      </div>
                      <Switch checked={req.completed} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
                <CardDescription>Track the status of all deliverable items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCustomer.deliverables.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{item.item}</h4>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            Delivered: {new Date(item.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={item.status === 'Delivered' ? 'success' : 
                                item.status === 'In Progress' ? 'warning' : 'secondary'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}