'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, Edit, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PhotosPage() {
  const [photos, setPhotos] = useState([
    { id: 1, title: 'Wedding Photo 1', category: 'Wedding', url: '/gallery-1.jpg' },
    { id: 2, title: 'Pre-Wedding 1', category: 'Pre-Wedding', url: '/gallery-2.jpg' },
    { id: 3, title: 'Wedding Photo 2', category: 'Wedding', url: '/gallery-3.jpg' },
    // Add more photos as needed
  ])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // Handle file drop
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Photo Management</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-12 text-center"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop photos here, or click to select files
        </p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Input placeholder="Search photos..." className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Photos</DropdownMenuItem>
            <DropdownMenuItem>Wedding</DropdownMenuItem>
            <DropdownMenuItem>Pre-Wedding</DropdownMenuItem>
            <DropdownMenuItem>Events</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <Button size="icon" variant="ghost" className="text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{photo.title}</h3>
                  <p className="text-sm text-gray-500">{photo.category}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

