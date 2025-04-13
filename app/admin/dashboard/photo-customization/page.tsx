'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, Upload, Trash2, Edit, Plus, 
  Search, Filter, RefreshCw, Save,
  FolderOpen, CheckCircle, AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Import the photo service
import { Photo, getPhotos, savePhoto, deletePhoto, getAvailablePages, getAvailableSections } from "@/app/lib/photoService"


export default function PhotoCustomizationPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageFilter, setPageFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [isEditing, setIsEditing] = useState(false)
  const [editedPhoto, setEditedPhoto] = useState<Partial<Photo>>({})
  const [availablePages, setAvailablePages] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])

  // Load photos from localStorage on component mount
  useEffect(() => {
    const loadedPhotos = getPhotos()
    setPhotos(loadedPhotos)
    
    // Load available pages and sections
    setAvailablePages(getAvailablePages())
  }, [])

  // Update available sections when page filter changes
  useEffect(() => {
    if (pageFilter !== 'all') {
      setAvailableSections(getAvailableSections(pageFilter))
    } else {
      setAvailableSections([])
    }
  }, [pageFilter])

  // Filter photos based on search query and filters
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = 
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.section.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPage = pageFilter === 'all' || photo.page === pageFilter
    const matchesSection = sectionFilter === 'all' || photo.section === sectionFilter
    
    return matchesSearch && matchesPage && matchesSection
  })

  // Handle file upload and save to photoService
  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    // Create a temporary URL for the uploaded file
    const imageUrl = URL.createObjectURL(file)

    // Create new photo object
    const newPhoto: Photo = {
      id: String(Date.now()),
      section: editedPhoto.section || 'New Section',
      page: editedPhoto.page || 'New Page',
      description: editedPhoto.description || file.name,
      imageUrl: imageUrl, // In a real app, this would be a server path after upload
      altText: editedPhoto.altText || file.name,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin'
    }

    // Save to localStorage via photoService
    savePhoto(newPhoto)
    
    // Update local state
    setPhotos([...photos, newPhoto])
    setIsUploading(false)
    setUploadProgress(0)
    setEditedPhoto({})
    
    // Show success message
    toast({
      title: "Photo Added",
      description: "The new photo has been added successfully.",
    })
    
    // Update available pages and sections
    setAvailablePages(getAvailablePages())
    if (newPhoto.page && pageFilter === newPhoto.page) {
      setAvailableSections(getAvailableSections(newPhoto.page))
    }
  }

  // Handle photo update
  const handlePhotoUpdate = () => {
    if (!selectedPhoto) return

    // Create updated photo object
    const updatedPhoto: Photo = {
      ...selectedPhoto,
      ...editedPhoto as Photo,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin'
    }

    // Save to localStorage via photoService
    savePhoto(updatedPhoto)

    // Update local state
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === selectedPhoto.id
          ? updatedPhoto
          : photo
      )
    )

    setIsEditing(false)
    setSelectedPhoto(null)
    setEditedPhoto({})

    // Show success message
    toast({
      title: "Photo Updated",
      description: "The photo has been updated successfully.",
    })

    // Update available pages and sections if needed
    if (updatedPhoto.page !== selectedPhoto.page) {
      setAvailablePages(getAvailablePages())
    }
  }

  // Handle photo deletion
  const handlePhotoDelete = (id: string) => {
    // Delete from localStorage via photoService
    const success = deletePhoto(id)
    
    if (success) {
      // Update local state
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id))
      setSelectedPhoto(null)
      
      // Show success message
      toast({
        title: "Photo Deleted",
        description: "The photo has been deleted successfully.",
      })
      
      // Update available pages and sections
      setAvailablePages(getAvailablePages())
    } else {
      // Show error message
      toast({
        title: "Error",
        description: "Failed to delete the photo.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Photo Customization</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Photo</DialogTitle>
              <DialogDescription>
                Upload a new photo and provide its details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page" className="text-right">Page</Label>
                <Input
                  id="page"
                  className="col-span-3"
                  value={editedPhoto.page || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, page: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
                <Input
                  id="section"
                  className="col-span-3"
                  value={editedPhoto.section || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, section: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  value={editedPhoto.description || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="altText" className="text-right">Alt Text</Label>
                <Input
                  id="altText"
                  className="col-span-3"
                  value={editedPhoto.altText || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, altText: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="text-right">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={pageFilter} onValueChange={setPageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {availablePages.map(page => (
              <SelectItem key={page} value={page}>{page}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sectionFilter} onValueChange={setSectionFilter} disabled={pageFilter === 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {availableSections.map(section => (
              <SelectItem key={section} value={section}>{section}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img
                  src={photo.imageUrl}
                  alt={photo.altText}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setSelectedPhoto(photo)
                      setEditedPhoto(photo)
                      setIsEditing(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handlePhotoDelete(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{photo.description}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{photo.page}</Badge>
                  <Badge variant="secondary">{photo.section}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {photo.lastUpdated} by {photo.updatedBy}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4">
                <img
                  src={editedPhoto.imageUrl || ''}
                  alt={editedPhoto.altText || 'Photo preview'}
                  className="object-cover w-full h-full"
                />
              </div>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="w-full"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    const imageUrl = URL.createObjectURL(file);
                    setEditedPhoto({ ...editedPhoto, imageUrl });
                    
                    // In a real app, you would upload the file to a server here
                    // For now, we're just updating the URL in the local state
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">Upload a new image to replace the current one</p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-page" className="text-right">Page</Label>
                <Input
                  id="edit-page"
                  className="col-span-3"
                  value={editedPhoto.page || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, page: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-section" className="text-right">Section</Label>
                <Input
                  id="edit-section"
                  className="col-span-3"
                  value={editedPhoto.section || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, section: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  className="col-span-3"
                  value={editedPhoto.description || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-altText" className="text-right">Alt Text</Label>
                <Input
                  id="edit-altText"
                  className="col-span-3"
                  value={editedPhoto.altText || ''}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, altText: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handlePhotoUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}