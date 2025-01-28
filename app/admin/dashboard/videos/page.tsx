'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileVideo, Upload, Filter, Grid, List, 
  MoreVertical, Download, Trash2, Edit2, Play,
  Pause, Volume2, VolumeX, Maximize2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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

interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  category: string
  uploadDate: string
  duration: string
  size: string
  resolution: string
}

// Mock data - Replace with real API calls
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Wedding Ceremony Highlights',
    url: '/videos/wedding1.mp4',
    thumbnail: '/thumbnails/wedding1.jpg',
    category: 'Wedding',
    uploadDate: '2024-01-28',
    duration: '5:30',
    size: '245 MB',
    resolution: '4K'
  },
  {
    id: '2',
    title: 'Reception Party',
    url: '/videos/reception.mp4',
    thumbnail: '/thumbnails/reception.jpg',
    category: 'Reception',
    uploadDate: '2024-01-27',
    duration: '3:45',
    size: '180 MB',
    resolution: '1080p'
  },
  // Add more mock videos...
]

export default function VideosPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const categories = ['All', 'Wedding', 'Reception', 'Pre-Wedding', 'Engagement']

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
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
          <h2 className="text-3xl font-bold">Video Gallery</h2>
          <p className="text-muted-foreground">
            Manage and organize your professional videos
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Upload className="mr-2 h-4 w-4" />
              Upload Videos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Videos</DialogTitle>
              <DialogDescription>
                Drag and drop your videos here or click to browse
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <FileVideo className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2">Click to browse or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  Supports: MP4, MOV, WebM (Max 2GB each)
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
                placeholder="Search videos..."
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

      {/* Video Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
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
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            setSelectedVideo(video)
                            setIsPlaying(true)
                          }}
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-2">
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
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-white text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{video.category}</span>
                      <span>•</span>
                      <span>{video.resolution}</span>
                    </div>
                  </CardContent>
                </>
              ) : (
                // List View
                <div className="flex items-center p-4">
                  <div className="relative h-24 w-40 mr-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-full rounded"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-white text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                      <span>{video.category}</span>
                      <span>{video.uploadDate}</span>
                      <span>{video.resolution}</span>
                      <span>{video.size}</span>
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
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </DropdownMenuItem>
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

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
              <DialogDescription>
                {selectedVideo.category} • {selectedVideo.resolution}
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video bg-black">
              <video
                src={selectedVideo.url}
                poster={selectedVideo.thumbnail}
                className="w-full h-full"
                controls
                autoPlay
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
