'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
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

interface InventoryItem {
  id: string
  name: string
  category: string
  status: 'available' | 'in-use' | 'maintenance' | 'retired'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  purchaseDate: string
  lastMaintenance: string
  nextMaintenance: string
  serialNumber: string
  notes: string
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Canon EOS R5',
    category: 'Camera',
    status: 'available',
    condition: 'excellent',
    purchaseDate: '2023-01-15',
    lastMaintenance: '2023-12-01',
    nextMaintenance: '2024-06-01',
    serialNumber: 'CR5-123456',
    notes: 'Primary wedding ceremony camera'
  },
  {
    id: '2',
    name: 'RF 70-200mm f/2.8',
    category: 'Lens',
    status: 'in-use',
    condition: 'good',
    purchaseDate: '2023-02-20',
    lastMaintenance: '2023-11-15',
    nextMaintenance: '2024-05-15',
    serialNumber: 'RF70-789012',
    notes: 'Main telephoto lens'
  }
]

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const categories = ['All', 'Camera', 'Lens', 'Lighting', 'Tripod', 'Accessory']
  const statuses = ['All', 'available', 'in-use', 'maintenance', 'retired']

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500'
      case 'in-use': return 'text-blue-500'
      case 'maintenance': return 'text-yellow-500'
      case 'retired': return 'text-red-500'
      default: return ''
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'fair': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'poor': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Equipment Inventory</h2>
          <p className="text-muted-foreground">
            Manage your photography equipment and accessories
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            {/* Add equipment form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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

      {/* Inventory List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
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
                    <Label className="text-sm font-medium">Serial Number</Label>
                    <p className="text-sm">{item.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Condition</Label>
                    <div className="flex items-center gap-1">
                      {getConditionIcon(item.condition)}
                      <span className="text-sm">
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Maintenance</Label>
                    <p className="text-sm">{new Date(item.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Next Maintenance</Label>
                    <p className="text-sm">{new Date(item.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
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