'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Download, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Photo {
  id: string
  url: string
  guestName: string
  uploadDate: string
  faces: {
    confidence: number
    expression: string
  }[]
  shared: boolean
}

export default function GuestPhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // In production, fetch from your API
    const mockPhotos: Photo[] = [
      {
        id: '1',
        url: '/images/gallery-1.jpg',
        guestName: 'John Doe',
        uploadDate: '2024-01-20',
        faces: [{ confidence: 0.98, expression: 'happy' }],
        shared: true
      },
      {
        id: '2',
        url: '/images/gallery-2.jpg',
        guestName: 'Jane Smith',
        uploadDate: '2024-01-20',
        faces: [{ confidence: 0.95, expression: 'neutral' }],
        shared: false
      }
    ]
    setPhotos(mockPhotos)
  }, [])

  const handleShare = async (photo: Photo) => {
    try {
      // In production, implement sharing logic
      toast({
        title: 'Success',
        description: 'Photo shared successfully!'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share photo',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (photoId: string) => {
    try {
      // In production, implement delete logic
      setPhotos(photos.filter(p => p.id !== photoId))
      toast({
        title: 'Success',
        description: 'Photo deleted successfully!'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete photo',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif mb-4">Guest Photo Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all guest photos with AI-powered face recognition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={photo.url}
                    alt={`Photo by ${photo.guestName}`}
                    className="object-cover w-full h-full"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{photo.guestName}</h3>
                    <span className="text-sm text-gray-500">{photo.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {(photo.faces[0].confidence * 100).toFixed(0)}% Match
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                      {photo.faces[0].expression}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(photo)}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}