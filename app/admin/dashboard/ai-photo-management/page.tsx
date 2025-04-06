'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ImageIcon, Users, Sparkles, Filter, Sliders, 
  Search, Download, Upload, RefreshCw, Tag,
  Layers, Zap, UserCheck, Palette, Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Photo {
  id: string
  url: string
  title: string
  event: string
  date: string
  faces: {
    id: string
    name: string
    confidence: number
    box: { x: number, y: number, width: number, height: number }
  }[]
  tags: string[]
  aiSuggestions: string[]
  quality: number
  edited: boolean
}

// Mock data - Replace with real API calls
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: '/images/gallery-1.jpg',
    title: 'Ceremony Kiss',
    event: 'Smith-Johnson Wedding',
    date: '2024-01-15',
    faces: [
      { id: 'f1', name: 'John Smith', confidence: 0.98, box: { x: 120, y: 80, width: 100, height: 100 } },
      { id: 'f2', name: 'Sarah Johnson', confidence: 0.97, box: { x: 250, y: 80, width: 100, height: 100 } }
    ],
    tags: ['ceremony', 'kiss', 'couple'],
    aiSuggestions: ['Add to highlights', 'Feature on homepage'],
    quality: 95,
    edited: true
  },
  {
    id: '2',
    url: '/images/gallery-2.jpg',
    title: 'First Dance',
    event: 'Smith-Johnson Wedding',
    date: '2024-01-15',
    faces: [
      { id: 'f1', name: 'John Smith', confidence: 0.96, box: { x: 150, y: 100, width: 100, height: 100 } },
      { id: 'f2', name: 'Sarah Johnson', confidence: 0.95, box: { x: 280, y: 100, width: 100, height: 100 } }
    ],
    tags: ['reception', 'dance', 'couple'],
    aiSuggestions: ['Add to romantic collection'],
    quality: 88,
    edited: false
  },
  {
    id: '3',
    url: '/images/gallery-3.jpg',
    title: 'Family Portrait',
    event: 'Smith-Johnson Wedding',
    date: '2024-01-15',
    faces: [
      { id: 'f1', name: 'John Smith', confidence: 0.94, box: { x: 100, y: 120, width: 80, height: 80 } },
      { id: 'f2', name: 'Sarah Johnson', confidence: 0.93, box: { x: 200, y: 120, width: 80, height: 80 } },
      { id: 'f3', name: 'Robert Smith', confidence: 0.91, box: { x: 300, y: 120, width: 80, height: 80 } },
      { id: 'f4', name: 'Mary Johnson', confidence: 0.90, box: { x: 400, y: 120, width: 80, height: 80 } }
    ],
    tags: ['family', 'group', 'formal'],
    aiSuggestions: ['Include in family album'],
    quality: 92,
    edited: true
  }
];

export default function AIPhotoManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  
  // Batch editing states
  const [batchEditSettings, setBatchEditSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    applyWatermark: false,
    autoEnhance: true
  })

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(filteredPhotos.map(photo => photo.id))
    }
  }

  const handleBatchProcess = async () => {
    if (selectedPhotos.length === 0) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    
    // Simulate processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setProcessingProgress(i)
    }
    
    // Update processed photos
    setPhotos(photos.map(photo => 
      selectedPhotos.includes(photo.id)
        ? { ...photo, edited: true }
        : photo
    ))
    
    setIsProcessing(false)
    setProcessingProgress(0)
  }

  const handleFaceRecognition = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setProcessingProgress(i)
    }
    
    setIsProcessing(false)
    setProcessingProgress(0)
  }

  // Filter photos based on search and active tab
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      photo.faces.some(face => face.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'faces') return matchesSearch && photo.faces.length > 0
    if (activeTab === 'edited') return matchesSearch && photo.edited
    if (activeTab === 'suggestions') return matchesSearch && photo.aiSuggestions.length > 0
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">AI Photo Management</h2>
          <p className="text-muted-foreground">
            Advanced tools for organizing and enhancing your wedding photography
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleFaceRecognition}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Run Face Recognition
          </Button>
          <Button 
            variant="default" 
            onClick={handleBatchProcess}
            disabled={isProcessing || selectedPhotos.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Process Selected
          </Button>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Processing photos...</p>
                <p className="text-sm">{processingProgress}%</p>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tools & Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Photos</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, tag, person..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Batch Edit Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Batch Edit Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brightness">Brightness</Label>
                    <span className="text-xs">{batchEditSettings.brightness}%</span>
                  </div>
                  <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchEditSettings.brightness]}
                    onValueChange={([value]) => setBatchEditSettings({...batchEditSettings, brightness: value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contrast">Contrast</Label>
                    <span className="text-xs">{batchEditSettings.contrast}%</span>
                  </div>
                  <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchEditSettings.contrast]}
                    onValueChange={([value]) => setBatchEditSettings({...batchEditSettings, contrast: value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="saturation">Saturation</Label>
                    <span className="text-xs">{batchEditSettings.saturation}%</span>
                  </div>
                  <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchEditSettings.saturation]}
                    onValueChange={([value]) => setBatchEditSettings({...batchEditSettings, saturation: value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sharpness">Sharpness</Label>
                    <span className="text-xs">+{batchEditSettings.sharpness}</span>
                  </div>
                  <Slider
                    id="sharpness"
                    min={0}
                    max={100}
                    step={1}
                    value={[batchEditSettings.sharpness]}
                    onValueChange={([value]) => setBatchEditSettings({...batchEditSettings, sharpness: value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="watermark">Apply Watermark</Label>
                  <Switch
                    id="watermark"
                    checked={batchEditSettings.applyWatermark}
                    onCheckedChange={(checked) => setBatchEditSettings({...batchEditSettings, applyWatermark: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-enhance">AI Auto-Enhance</Label>
                  <Switch
                    id="auto-enhance"
                    checked={batchEditSettings.autoEnhance}
                    onCheckedChange={(checked) => setBatchEditSettings({...batchEditSettings, autoEnhance: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex items-center justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-start gap-2">
                  <Tag className="h-4 w-4" />
                  Batch Tag
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-start gap-2">
                  <Layers className="h-4 w-4" />
                  Create Album
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-start gap-2">
                  <Palette className="h-4 w-4" />
                  Color Match
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs and Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Photos</TabsTrigger>
                <TabsTrigger value="faces">Faces</TabsTrigger>
                <TabsTrigger value="edited">Edited</TabsTrigger>
                <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Select defaultValue="date-desc">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="quality-desc">Highest Quality</SelectItem>
                  <SelectItem value="faces-desc">Most Faces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-lg overflow-hidden border ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <div 
                  className="absolute inset-0 bg-black/5 z-10 cursor-pointer"
                  onClick={() => handleSelectPhoto(photo.id)}
                ></div>
                
                {/* Selection indicator */}
                {selectedPhotos.includes(photo.id) && (
                  <div className="absolute top-2 right-2 z-20 bg-primary text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
                
                {/* Photo */}
                <div className="aspect-square">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Face indicators */}
                {photo.faces.map((face) => (
                  <div 
                    key={face.id}
                    className="absolute z-20 border-2 border-green-400 rounded-sm"
                    style={{
                      left: `${face.box.x / 5}%`,
                      top: `${face.box.y / 5}%`,
                      width: `${face.box.width / 5}%`,
                      height: `${face.box.height / 5}%`
                    }}
                  >
                    <div className="absolute -bottom-6 left-0 bg-green-400 text-xs text-white px-1 py-0.5 rounded whitespace-nowrap">
                      {face.name} ({Math.round(face.confidence * 100)}%)
                    </div>
                  </div>
                ))}
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white z-20">
                  <h3 className="font-medium text-sm">{photo.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-80">{photo.event}</p>
                    <div className="flex items-center gap-1">
                      {photo.edited && (
                        <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                          Edited
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                        {photo.quality}% Quality
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-white/80 border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* AI suggestions */}
                {photo.aiSuggestions.length > 0 && (
                  <div className="absolute top-2 left-2 z-20">
                    <Badge className="bg-purple-600 text-white flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      AI Suggestion
                    </Badge>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}