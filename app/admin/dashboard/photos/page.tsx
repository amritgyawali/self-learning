'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ImageIcon, Upload, Filter, Grid, List, 
  MoreVertical, Download, Trash2, Edit2 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface Photo {
  id: string
  title: string
  url: string
  category: string
  uploadDate: string
  size: string
  dimensions: string
}

// Mock data - Replace with real API calls
const mockPhotos: Photo[] = [
  {
    id: '1',
    title: 'Wedding Ceremony',
    url: '/photos/wedding1.jpg',
    category: 'Wedding',
    uploadDate: '2024-01-28',
    size: '2.4 MB',
    dimensions: '3840 x 2160'
  },
  {
    id: '2',
    title: 'Reception Party',
    url: '/photos/reception.jpg',
    category: 'Reception',
    uploadDate: '2024-01-27',
    size: '1.8 MB',
    dimensions: '3840 x 2160'
  },
  // Add more mock photos...
]

export default function PhotosPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const categories = ['All', 'Wedding', 'Reception', 'Pre-Wedding', 'Engagement']

  const filteredPhotos = mockPhotos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUpload = async (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setUploadProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Photo Gallery</h2>
          <p className="text-muted-foreground">
            Manage and organize your professional photos
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Photos</DialogTitle>
              <DialogDescription>
                Drag and drop your photos here or click to browse
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2">Click to browse or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, WebP (Max 10MB each)
                </p>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {categories.slice(1).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary/10' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary/10' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="relative aspect-video group">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground">{photo.category}</p>
                  </CardContent>
                </>
              ) : (
                // List View
                <div className="flex items-center p-4">
                  <div className="h-16 w-16 mr-4">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{photo.title}</h3>
                    <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                      <span>{photo.category}</span>
                      <span>{photo.uploadDate}</span>
                      <span>{photo.dimensions}</span>
                      <span>{photo.size}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
