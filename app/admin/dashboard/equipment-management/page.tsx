'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, Wrench, AlertTriangle, Calendar, 
  Plus, Edit, Trash2, Search, Filter, Download,
  CheckCircle, XCircle, Clock, BarChart2, Tag, QrCode
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Equipment {
  id: string
  name: string
  type: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  status: 'available' | 'in-use' | 'maintenance' | 'retired'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  lastMaintenance?: string
  nextMaintenance?: string
  assignedTo?: string
  location?: string
  notes?: string
  image?: string
  specs: Record<string, string>
  maintenanceHistory: {
    date: string
    type: string
    description: string
    cost: number
    technician?: string
  }[]
  usageHistory: {
    date: string
    event: string
    photographer: string
    notes?: string
  }[]
  warranty: {
    provider: string
    expiryDate: string
    details: string
  }
  insurance: {
    provider: string
    policyNumber: string
    expiryDate: string
    coverage: number
  }
}

// Mock data - Replace with real API calls
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Canon EOS R5',
    type: 'Camera',
    brand: 'Canon',
    model: 'EOS R5',
    serialNumber: 'CR5-123456',
    purchaseDate: '2023-01-15',
    purchasePrice: 3899,
    currentValue: 3200,
    status: 'available',
    condition: 'excellent',
    lastMaintenance: '2023-12-01',
    nextMaintenance: '2024-06-01',
    location: 'Main Studio',
    notes: 'Primary wedding ceremony camera',
    image: '/images/equipment/canon-r5.jpg',
    specs: {
      'Sensor': '45MP Full-Frame CMOS',
      'ISO Range': '100-51200',
      'Video': '8K RAW up to 29.97 fps',
      'Stabilization': '5-axis IBIS',
      'Weather Sealing': 'Yes'
    },
    maintenanceHistory: [
      {
        date: '2023-12-01',
        type: 'Cleaning',
        description: 'Sensor cleaning and firmware update',
        cost: 150,
        technician: 'Canon Service Center'
      }
    ],
    usageHistory: [
      {
        date: '2024-01-20',
        event: 'Johnson Wedding',
        photographer: 'Mike Wilson',
        notes: 'Used for ceremony and portraits'
      },
      {
        date: '2024-01-05',
        event: 'Smith Engagement',
        photographer: 'Sarah Johnson',
        notes: 'Used for outdoor shoot'
      }
    ],
    warranty: {
      provider: 'Canon',
      expiryDate: '2025-01-15',
      details: '2-year manufacturer warranty'
    },
    insurance: {
      provider: 'PhotoPro Insurance',
      policyNumber: 'PP-12345',
      expiryDate: '2024-12-31',
      coverage: 4000
    }
  },
  {
    id: '2',
    name: 'RF 70-200mm f/2.8',
    type: 'Lens',
    brand: 'Canon',
    model: 'RF 70-200mm f/2.8L IS USM',
    serialNumber: 'RF70-789012',
    purchaseDate: '2023-02-20',
    purchasePrice: 2699,
    currentValue: 2400,
    status: 'in-use',
    condition: 'good',
    lastMaintenance: '2023-11-15',
    nextMaintenance: '2024-05-15',
    assignedTo: 'Sarah Johnson',
    notes: 'Main telephoto lens',
    image: '/images/equipment/rf-70-200.jpg',
    specs: {
      'Focal Length': '70-200mm',
      'Aperture': 'f/2.8',
      'Image Stabilization': 'Yes',
      'Filter Size': '77mm',
      'Weight': '1070g'
    },
    maintenanceHistory: [
      {
        date: '2023-11-15',
        type: 'Inspection',
        description: 'Optical alignment check',
        cost: 120,
        technician: 'Canon Service Center'
      }
    ],
    usageHistory: [
      {
        date: '2024-01-20',
        event: 'Johnson Wedding',
        photographer: 'Sarah Johnson',
        notes: 'Used for ceremony'
      }
    ],
    warranty: {
      provider: 'Canon',
      expiryDate: '2025-02-20',
      details: '2-year manufacturer warranty'
    },
    insurance: {
      provider: 'PhotoPro Insurance',
      policyNumber: 'PP-12346',
      expiryDate: '2024-12-31',
      coverage: 2800
    }
  },
  {
    id: '3',
    name: 'Profoto B10 Plus',
    type: 'Lighting',
    brand: 'Profoto',
    model: 'B10 Plus',
    serialNumber: 'PB10-345678',
    purchaseDate: '2023-03-10',
    purchasePrice: 2095,
    currentValue: 1800,
    status: 'maintenance',
    condition: 'fair',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-07-05',
    notes: 'Battery replacement needed',
    image: '/images/equipment/profoto-b10.jpg',
    specs: {
      'Power': '500Ws',
      'Battery Life': 'Up to 200 full-power flashes',
      'Recycling Time': '0.05-2.5s',
      'Weight': '1.9kg',
      'Bluetooth': 'Yes'
    },
    maintenanceHistory: [
      {
        date: '2024-01-05',
        type: 'Repair',
        description: 'Battery not holding charge, sent for replacement',
        cost: 250,
        technician: 'Profoto Service'
      },
      {
        date: '2023-09-10',
        type: 'Cleaning',
        description: 'General cleaning and inspection',
        cost: 80,
        technician: 'In-house'
      }
    ],
    usageHistory: [
      {
        date: '2023-12-15',
        event: 'Williams Wedding',
        photographer: 'Mike Wilson',
        notes: 'Used for reception lighting'
      }
    ],
    warranty: {
      provider: 'Profoto',
      expiryDate: '2025-03-10',
      details: '2-year manufacturer warranty'
    },
    insurance: {
      provider: 'PhotoPro Insurance',
      policyNumber: 'PP-12347',
      expiryDate: '2024-12-31',
      coverage: 2100
    }
  }
];

export default function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false)
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Filter equipment based on search query, type, and status
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    if (activeTab === 'all') return matchesSearch && matchesType && matchesStatus
    if (activeTab === 'maintenance') return matchesSearch && matchesType && (item.status === 'maintenance' || (item.nextMaintenance && new Date(item.nextMaintenance) <= new Date(new Date().setDate(new Date().getDate() + 30))))
    if (activeTab === 'in-use') return matchesSearch && matchesType && item.status === 'in-use'
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectEquipment = (item: Equipment) => {
    setSelectedEquipment(item)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'in-use': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'retired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'fair': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'poor': return <XCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const calculateDepreciation = (item: Equipment) => {
    const purchaseDate = new Date(item.purchaseDate)
    const today = new Date()
    const ageInYears = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    const depreciationRate = 0.15 // 15% per year
    const depreciationAmount = item.purchasePrice * depreciationRate * ageInYears
    return Math.max(item.purchasePrice - depreciationAmount, item.purchasePrice * 0.2) // Minimum value is 20% of purchase price
  }

  const calculateMaintenanceCost = (item: Equipment) => {
    return item.maintenanceHistory.reduce((total, record) => total + record.cost, 0)
  }

  const getDaysSinceLastMaintenance = (lastMaintenance?: string) => {
    if (!lastMaintenance) return null
    const lastDate = new Date(lastMaintenance)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lastDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDaysUntilNextMaintenance = (nextMaintenance?: string) => {
    if (!nextMaintenance) return null
    const nextDate = new Date(nextMaintenance)
    const today = new Date()
    const diffTime = nextDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Equipment Management</h2>
          <p className="text-muted-foreground">
            Track, maintain, and manage your photography equipment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showAddEquipmentDialog} onOpenChange={setShowAddEquipmentDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details of your new equipment item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name</Label>
                    <Input id="name" placeholder="Canon EOS R5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select defaultValue="camera">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="lens">Lens</SelectItem>
                        <SelectItem value="lighting">Lighting</SelectItem>
                        <SelectItem value="tripod">Tripod</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" placeholder="Canon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="EOS R5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input id="serialNumber" placeholder="CR5-123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input id="purchasePrice" type="number" placeholder="3899" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="available">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any relevant information about this equipment..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddEquipmentDialog(false)}>Cancel</Button>
                <Button>Add Equipment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR Codes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Equipment</CardTitle>
                <Badge variant="outline">{filteredEquipment.length} items</Badge>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                    <TabsTrigger value="maintenance" className="flex-1">Maintenance</TabsTrigger>
                    <TabsTrigger value="in-use" className="flex-1">In Use</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <div className="divide-y">
                    {filteredEquipment.length > 0 ? (
                      filteredEquipment.map(item => (
                        <div 
                          key={item.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedEquipment?.id === item.id ? 'bg-muted' : ''}`}
                          onClick={() => handleSelectEquipment(item)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                              {item.type === 'Camera' ? (
                                <Camera className="h-6 w-6 text-primary" />
                              ) : item.type === 'Lens' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                                  <circle cx="12" cy="12" r="9"></circle>
                                  <circle cx="12" cy="12" r="5"></circle>
                                </svg>
                              ) : item.type === 'Lighting' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                                  <path d="M12 2v8"></path>
                                  <path d="m4.93 10.93 1.41 1.41"></path>
                                  <path d="M2 18h2"></path>
                                  <path d="M20 18h2"></path>
                                  <path d="m19.07 10.93-1.41 1.41"></path>
                                  <path d="M22 22H2"></path>
                                  <path d="m8 22 4-10 4 10"></path>
                                </svg>
                              ) : (
                                <Tag className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{item.name}</p>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{item.brand} {item.model}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {getConditionIcon(item.condition)}
                                  <span className="text-xs capitalize">{item.condition}</span>
                                </div>
                                {item.nextMaintenance && (
                                  <Badge variant="outline" className="text-xs">
                                    <Wrench className="h-3 w-3 mr-1" />
                                    {new Date(item.nextMaintenance).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground">No equipment found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="maintenance" className="m-0">
                  {/* Similar content for maintenance tab */}
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Maintenance items will appear here</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="in-use" className="m-0">
                  {/* Similar content for in-use tab */}
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">In-use items will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Details */}
        <div className="lg:col-span-2">
          {selectedEquipment ? (
            <div className="space-y-6">
              {/* Equipment Profile */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 w-full md:w-1/3">
                      <div className="bg-muted rounded-md aspect-square flex items-center justify-center">
                        {selectedEquipment.image ? (
                          <img 
                            src={selectedEquipment.image} 
                            alt={selectedEquipment.name} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : selectedEquipment.type === 'Camera' ? (
                          <Camera className="h-16 w-16 text-muted-foreground" />
                        ) : (
                          <Tag className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{selectedEquipment.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(selectedEquipment.status)}>
                              {selectedEquipment.status.charAt(0).toUpperCase() + selectedEquipment.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getConditionIcon(selectedEquipment.condition)}
                              <span className="capitalize">{selectedEquipment.condition}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Wrench className="h-4 w-4" />
                                Schedule Maintenance
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>Schedule Maintenance</DialogTitle>
                                <DialogDescription>
                                  Schedule maintenance for {selectedEquipment.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="maintenance-date">Maintenance Date</Label>
                                    <Input id="maintenance-date" type="date" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="maintenance-type">Type</Label>
                                    <Select defaultValue="cleaning">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="inspection">Inspection</SelectItem>
                                        <SelectItem value="repair">Repair</SelectItem>
                                        <SelectItem value="calibration">Calibration</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="maintenance-notes">Notes</Label>
                                  <Textarea id="maintenance-notes" placeholder="Describe the maintenance needed..." />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="maintenance-provider">Service Provider</Label>
                                  <Input id="maintenance-provider" placeholder="Canon Service Center" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                                  <Input id="estimated-cost" type="number" placeholder="150" />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>Cancel</Button>
                                <Button>Schedule Maintenance</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Equipment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Brand</p>
                          <p>{selectedEquipment.brand}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Model</p>
                          <p>{selectedEquipment.model}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                          <p>{selectedEquipment.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                          <p>{new Date(selectedEquipment.purchaseDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                          <p>${selectedEquipment.purchasePrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                          <p>${calculateDepreciation(selectedEquipment).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tabs for additional details */}
              <Tabs defaultValue="specs">
                <TabsList className="w-full">
                  <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
                  <TabsTrigger value="maintenance" className="flex-1">Maintenance</TabsTrigger>
                  <TabsTrigger value="usage" className="flex-1">Usage History</TabsTrigger>
                  <TabsTrigger value="warranty" className="flex-1">Warranty & Insurance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specs" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          {Object.entries(selectedEquipment.specs).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium">{key}</TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="maintenance" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Maintenance History</CardTitle>
                        <CardDescription>
                          Total maintenance cost: ${calculateMaintenanceCost(selectedEquipment)}
                        </CardDescription>
                      </div>
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add Record
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {selectedEquipment.maintenanceHistory.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Technician</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEquipment.maintenanceHistory.map((record, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                <TableCell>{record.type}</TableCell>
                                <TableCell>{record.description}</TableCell>
                                <TableCell>${record.cost}</TableCell>
                                <TableCell>{record.technician || 'N/A'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No maintenance records found</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">Last Maintenance</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEquipment.lastMaintenance ? (
                            <>
                              {new Date(selectedEquipment.lastMaintenance).toLocaleDateString()}
                              <span className="ml-2 text-xs">
                                ({getDaysSinceLastMaintenance(selectedEquipment.lastMaintenance)} days ago)
                              </span>
                            </>
                          ) : (
                            'None recorded'
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Next Maintenance</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEquipment.nextMaintenance ? (
                            <>
                              {new Date(selectedEquipment.nextMaintenance).toLocaleDateString()}
                              <span className="ml-2 text-xs">
                                (in {getDaysUntilNextMaintenance(selectedEquipment.nextMaintenance)} days)
                              </span>
                            </>
                          ) : (
                            'Not scheduled'
                          )}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="usage" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Usage History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEquipment.usageHistory.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Event</TableHead>
                              <TableHead>Photographer</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedEquipment.usageHistory.map((record, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                <TableCell>{record.event}</TableCell>
                                <TableCell>{record.photographer}</TableCell>
                                <TableCell>{record.notes || 'N/A'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No usage records found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="warranty" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Warranty Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Provider</p>
                            <p>{selectedEquipment.warranty.provider}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                            <p>
                              {new Date(selectedEquipment.warranty.expiryDate).toLocaleDateString()}
                              {new Date(selectedEquipment.warranty.expiryDate) > new Date() ? (
                                <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge className="ml-2 bg-red-100 text-red-800">Expired</Badge>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Details</p>
                            <p>{selectedEquipment.warranty.details}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Insurance Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Provider</p>
                            <p>{selectedEquipment.insurance.provider}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                            <p>{selectedEquipment.insurance.policyNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                            <p>
                              {new Date(selectedEquipment.insurance.expiryDate).toLocaleDateString()}
                              {new Date(selectedEquipment.insurance.expiryDate) > new Date() ? (
                                <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge className="ml-2 bg-red-100 text-red-800">Expired</Badge>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Coverage Amount</p>
                            <p>${selectedEquipment.insurance.coverage.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Equipment Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select an equipment item from the list to view details
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}