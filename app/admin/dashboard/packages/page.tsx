'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash, Save, X, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import { Package } from '@/types'
import { getAllPackages, addPackage, updatePackage, deletePackage, resetPackagesToDefault } from '@/app/lib/packageService'

// No need for initialPackages as we're using the packageService

interface PackageFormData {
  id: number
  name: string
  price: number
  description: string
  category: 'package' | 'service'
  defaultDays: number
}

export default function PackagesPage() {
  // State for packages data
  const [packages, setPackages] = useState<PackageFormData[]>([])
  const [filteredPackages, setFilteredPackages] = useState<PackageFormData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // State for package form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<PackageFormData>({
    id: 0,
    name: '',
    price: 0,
    description: '',
    category: 'package',
    defaultDays: 1
  })

  // Load packages on component mount
  useEffect(() => {
    // Load packages using the packageService
    const loadedPackages = getAllPackages()
    setPackages(loadedPackages.map(pkg => ({
      ...pkg,
      description: pkg.description || '',
      defaultDays: pkg.defaultDays || 1 // Ensure defaultDays is never undefined
    })))
  }, [])

  // Update filtered packages when packages, search query, or category filter changes
  useEffect(() => {
    let filtered = [...packages]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter)
    }
    
    setFilteredPackages(filtered)
  }, [packages, searchQuery, categoryFilter])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentPackage(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'defaultDays' ? Number(value) : value
    }))
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setCurrentPackage(prev => ({
      ...prev,
      category: value as 'package' | 'service'
    }))
  }

  // Handle adding a new package
  const handleAddPackage = () => {
    // Use the packageService to add a new package
    const { id, ...packageData } = currentPackage
    const newPackage = addPackage(packageData)
    
    // Update the local state
setPackages([...packages, { ...newPackage, description: newPackage.description ?? '', defaultDays: newPackage.defaultDays ?? 1 }])
    
    // Reset form and close dialog
    setCurrentPackage({
      id: 0,
      name: '',
      price: 0,
      description: '',
      category: 'package',
      defaultDays: 1
    })
    setIsAddDialogOpen(false)
  }

  // Handle editing a package
  const handleEditPackage = (pkg: PackageFormData) => {
    setCurrentPackage(pkg)
    setIsEditDialogOpen(true)
  }

  // Handle updating a package
  const handleUpdatePackage = () => {
    // Use the packageService to update the package
    const updatedPackage = updatePackage(currentPackage)
    
    if (updatedPackage) {
      // Update the local state
      const updatedPackages = packages.map(pkg =>
        pkg.id === currentPackage.id ? updatedPackage : pkg
      )
      setPackages(updatedPackages.map(pkg => ({
        ...pkg,
        description: pkg.description || '',
        defaultDays: pkg.defaultDays || 1
      })))
    }
    
    // Reset form and close dialog
    setCurrentPackage({
      id: 0,
      name: '',
      price: 0,
      description: '',
      category: 'package',
      defaultDays: 1
    })
    setIsEditDialogOpen(false)
  }

  // Handle deleting a package
  const handleDeletePackage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      // Use the packageService to delete the package
      const success = deletePackage(id)
      
      if (success) {
        // Update the local state
        const updatedPackages = packages.filter(pkg => pkg.id !== id)
        setPackages(updatedPackages)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Package Management</h2>
          <p className="text-muted-foreground">
            Manage photography packages and services for booking page
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all packages to default? This will delete any custom packages you have created.')) {
                resetPackagesToDefault()
setPackages(getAllPackages().map(pkg => ({
  ...pkg,
  description: pkg.description || '',
  defaultDays: pkg.defaultDays || 1
})))
              }
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Package
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Package</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentPackage.name}
                    onChange={handleInputChange}
                    placeholder="Enter package name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (RS)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={currentPackage.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentPackage.description}
                    onChange={handleInputChange}
                    placeholder="Enter package description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentPackage.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="package">Package</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultDays">Default Days</Label>
                  <Input
                    id="defaultDays"
                    name="defaultDays"
                    type="number"
                    min="1"
                    max="5"
                    value={currentPackage.defaultDays}
                    onChange={handleInputChange}
                    placeholder="Enter default days"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddPackage}>Add Package</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="package">Packages</SelectItem>
                <SelectItem value="service">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price (RS)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Default Days</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.price.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{pkg.category}</TableCell>
                  <TableCell>{pkg.defaultDays}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPackage(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Package Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={currentPackage.name}
                onChange={handleInputChange}
                placeholder="Enter package name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (RS)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={currentPackage.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={currentPackage.description}
                onChange={handleInputChange}
                placeholder="Enter package description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={currentPackage.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-defaultDays">Default Days</Label>
              <Input
                id="edit-defaultDays"
                name="defaultDays"
                type="number"
                min="1"
                max="5"
                value={currentPackage.defaultDays}
                onChange={handleInputChange}
                placeholder="Enter default days"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdatePackage}>Update Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )}
