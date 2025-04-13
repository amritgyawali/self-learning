'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ImageIcon, Users, User, Sparkles, Filter, Sliders, 
  Search, Download, Upload, RefreshCw, Tag,
  Layers, Zap, UserCheck, Palette, Clock, 
  Scissors, Wand2, Smile, Trash2, Save, 
  Maximize, Minimize, RotateCcw, RotateCw, 
  SlidersHorizontal, Eye, EyeOff, Share2, 
  FileText, Crop, PenTool, Brush, Droplets,
  Aperture, Camera, Sun, Moon, CloudRain, 
  Workflow, Lightbulb, BrainCircuit, Fingerprint,
  Scan, QrCode, Repeat, Undo, Redo, Bookmark,
  Star, Heart, MessageSquare, Settings, HelpCircle,
  X, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  metadata?: {
    camera?: string
    lens?: string
    aperture?: string
    shutterSpeed?: string
    iso?: number
    focalLength?: string
    location?: { lat: number, lng: number, name?: string }
    dimensions?: { width: number, height: number }
    fileSize?: string
  }
  styleTransfers?: {
    id: string
    name: string
    previewUrl: string
    applied: boolean
  }[]
  smartCrops?: {
    id: string
    aspectRatio: string
    previewUrl: string
    applied: boolean
  }[]
  enhancementHistory?: {
    id: string
    timestamp: string
    type: string
    parameters?: Record<string, any>
    previewUrl?: string
  }[]
}

// AI Style presets
const stylePresets = [
  { id: 'vintage', name: 'Vintage Film', description: 'Classic film look with warm tones and subtle grain' },
  { id: 'bw-dramatic', name: 'B&W Dramatic', description: 'High contrast black and white with deep shadows' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-like color grading with teal and orange tones' },
  { id: 'portrait-soft', name: 'Portrait Soft', description: 'Soft, flattering skin tones ideal for portraits' },
  { id: 'vibrant', name: 'Vibrant', description: 'Enhanced colors and contrast for impactful images' },
  { id: 'moody', name: 'Moody', description: 'Dark, atmospheric look with rich colors' },
  { id: 'fine-art', name: 'Fine Art', description: 'Elegant, painterly look with subtle colors' },
  { id: 'hdr', name: 'HDR Natural', description: 'Enhanced dynamic range without looking artificial' },
]

// Smart cropping presets
const cropPresets = [
  { id: 'portrait', name: 'Portrait (3:4)', aspectRatio: '3:4' },
  { id: 'landscape', name: 'Landscape (4:3)', aspectRatio: '4:3' },
  { id: 'square', name: 'Square (1:1)', aspectRatio: '1:1' },
  { id: 'widescreen', name: 'Widescreen (16:9)', aspectRatio: '16:9' },
  { id: 'panorama', name: 'Panorama (2:1)', aspectRatio: '2:1' },
  { id: 'instagram', name: 'Instagram (4:5)', aspectRatio: '4:5' },
  { id: 'facebook', name: 'Facebook Cover (2.7:1)', aspectRatio: '2.7:1' },
  { id: 'twitter', name: 'Twitter Header (3:1)', aspectRatio: '3:1' },
]

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
    edited: true,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 50mm f/1.2L',
      aperture: 'f/1.8',
      shutterSpeed: '1/200s',
      iso: 400,
      focalLength: '50mm',
      dimensions: { width: 6000, height: 4000 },
      fileSize: '24.5 MB'
    },
    styleTransfers: [
      { id: 'st1', name: 'Vintage Film', previewUrl: '/images/gallery-1.jpg', applied: false },
      { id: 'st2', name: 'B&W Dramatic', previewUrl: '/images/gallery-1.jpg', applied: false }
    ],
    smartCrops: [
      { id: 'sc1', aspectRatio: '3:4', previewUrl: '/images/gallery-1.jpg', applied: false },
      { id: 'sc2', aspectRatio: '1:1', previewUrl: '/images/gallery-1.jpg', applied: false }
    ]
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
    edited: false,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 24-70mm f/2.8L',
      aperture: 'f/2.8',
      shutterSpeed: '1/125s',
      iso: 1600,
      focalLength: '50mm',
      dimensions: { width: 6000, height: 4000 },
      fileSize: '22.8 MB'
    }
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
    edited: true,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 24-70mm f/2.8L',
      aperture: 'f/4.0',
      shutterSpeed: '1/160s',
      iso: 800,
      focalLength: '35mm',
      dimensions: { width: 6000, height: 4000 },
      fileSize: '23.2 MB'
    }
  },
  {
    id: '4',
    url: '/images/gallery-4.jpg',
    title: 'Venue Details',
    event: 'Smith-Johnson Wedding',
    date: '2024-01-15',
    faces: [],
    tags: ['venue', 'details', 'decoration'],
    aiSuggestions: ['Use for venue marketing'],
    quality: 96,
    edited: true,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 24-70mm f/2.8L',
      aperture: 'f/5.6',
      shutterSpeed: '1/100s',
      iso: 400,
      focalLength: '24mm',
      dimensions: { width: 6000, height: 4000 },
      fileSize: '21.5 MB'
    }
  },
  {
    id: '5',
    url: '/images/gallery-5.jpg',
    title: 'Bride Portrait',
    event: 'Smith-Johnson Wedding',
    date: '2024-01-15',
    faces: [
      { id: 'f2', name: 'Sarah Johnson', confidence: 0.99, box: { x: 200, y: 100, width: 120, height: 120 } }
    ],
    tags: ['bride', 'portrait', 'preparation'],
    aiSuggestions: ['Feature in bridal collection', 'Use for marketing'],
    quality: 98,
    edited: true,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 85mm f/1.2L',
      aperture: 'f/1.4',
      shutterSpeed: '1/200s',
      iso: 320,
      focalLength: '85mm',
      dimensions: { width: 6000, height: 4000 },
      fileSize: '25.1 MB'
    }
  }
];

// Mock people data for face recognition
const mockPeople = [
  { id: 'p1', name: 'John Smith', role: 'Groom', faceCount: 42, events: ['Smith-Johnson Wedding'] },
  { id: 'p2', name: 'Sarah Johnson', role: 'Bride', faceCount: 56, events: ['Smith-Johnson Wedding'] },
  { id: 'p3', name: 'Robert Smith', role: 'Father of Groom', faceCount: 18, events: ['Smith-Johnson Wedding'] },
  { id: 'p4', name: 'Mary Johnson', role: 'Mother of Bride', faceCount: 22, events: ['Smith-Johnson Wedding'] },
  { id: 'p5', name: 'David Wilson', role: 'Best Man', faceCount: 15, events: ['Smith-Johnson Wedding'] },
  { id: 'p6', name: 'Emily Davis', role: 'Maid of Honor', faceCount: 19, events: ['Smith-Johnson Wedding'] },
]

export default function AIPhotoManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showPhotoDetails, setShowPhotoDetails] = useState(false)
  const [showFaceManager, setShowFaceManager] = useState(false)
  const [showStyleTransfer, setShowStyleTransfer] = useState(false)
  const [showSmartCropping, setShowSmartCropping] = useState(false)
  const [showAISettings, setShowAISettings] = useState(false)
  const [people, setPeople] = useState(mockPeople)
  const [activeAIModel, setActiveAIModel] = useState('standard')
  const [processingType, setProcessingType] = useState('')
  const [showFaces, setShowFaces] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [enhancementHistory, setEnhancementHistory] = useState<any[]>([])
  
  // Batch editing states
  const [batchEditSettings, setBatchEditSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    highlights: 0,
    shadows: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0,
    clarity: 0,
    noise: 0,
    vignette: 0,
    applyWatermark: false,
    autoEnhance: true,
    removeBackground: false,
    enhanceDetails: false,
    reduceNoise: false,
    smartLighting: true
  })

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    faceRecognitionThreshold: 80,
    autoTaggingEnabled: true,
    styleTransferStrength: 75,
    enhancementLevel: 'balanced', // 'subtle', 'balanced', 'dramatic'
    smartCroppingPriority: 'faces', // 'faces', 'composition', 'balanced'
    backgroundRemovalQuality: 'high', // 'fast', 'balanced', 'high'
    processingPriority: 'quality', // 'speed', 'balanced', 'quality'
    saveOriginals: true,
    autoOrganize: true,
    suggestionsEnabled: true
  })

  // Ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    setShowPhotoDetails(true)
  }

  const handleBatchProcess = async () => {
    if (selectedPhotos.length === 0) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('enhancement')
    
    // Simulate processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setProcessingProgress(i)
    }
    
    // Update processed photos
    setPhotos(photos.map(photo => 
      selectedPhotos.includes(photo.id)
        ? { 
            ...photo, 
            edited: true,
            enhancementHistory: [
              ...(photo.enhancementHistory || []),
              {
                id: `enh-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'AI Enhancement',
                parameters: { ...batchEditSettings },
                previewUrl: photo.url
              }
            ]
          }
        : photo
    ))
    
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingType('')
    
    toast({
      title: "Processing Complete",
      description: `Successfully enhanced ${selectedPhotos.length} photos.`,
    })
  }

  const handleFaceRecognition = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('face-recognition')
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setProcessingProgress(i)
    }
    
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingType('')
    
    toast({
      title: "Face Recognition Complete",
      description: `Identified ${Math.floor(Math.random() * 10) + 20} faces across your photos.`,
    })
  }

  const handleStyleTransfer = async () => {
    if (!selectedPhoto || !selectedStyle) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('style-transfer')
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 60))
      setProcessingProgress(i)
    }
    
    // Update the photo with style transfer
    setPhotos(photos.map(photo => 
      photo.id === selectedPhoto.id
        ? { 
            ...photo, 
            edited: true,
            enhancementHistory: [
              ...(photo.enhancementHistory || []),
              {
                id: `style-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'Style Transfer',
                parameters: { style: selectedStyle, strength: aiSettings.styleTransferStrength },
                previewUrl: photo.url
              }
            ]
          }
        : photo
    ))
    
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingType('')
    
    toast({
      title: "Style Transfer Complete",
      description: `Applied ${selectedStyle} style to the selected photo.`,
    })
  }

  const handleSmartCrop = async () => {
    if (!selectedPhoto || !selectedCrop) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('smart-crop')
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(resolve => setTimeout(resolve, 70))
      setProcessingProgress(i)
    }
    
    // Update the photo with smart crop
    setPhotos(photos.map(photo => 
      photo.id === selectedPhoto.id
        ? { 
            ...photo, 
            edited: true,
            enhancementHistory: [
              ...(photo.enhancementHistory || []),
              {
                id: `crop-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'Smart Crop',
                parameters: { aspectRatio: selectedCrop, priority: aiSettings.smartCroppingPriority },
                previewUrl: photo.url
              }
            ]
          }
        : photo
    ))
    
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingType('')
    
    toast({
      title: "Smart Cropping Complete",
      description: `Applied ${selectedCrop} crop to the selected photo.`,
    })
  }

  const handleBatchTag = async () => {
    if (selectedPhotos.length === 0) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('auto-tagging')
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 60))
      setProcessingProgress(i)
    }
    
    // Generate some random tags
    const possibleTags = ['wedding', 'ceremony', 'reception', 'couple', 'bride', 'groom', 'family', 
                         'venue', 'details', 'flowers', 'cake', 'dance', 'portrait', 'group', 
                         'candid', 'emotional', 'outdoor', 'indoor', 'sunset', 'decoration']
    
    // Update photos with new tags
    setPhotos(photos.map(photo => {
      if (selectedPhotos.includes(photo.id)) {
        // Add 2-4 random tags that aren't already on the photo
        const availableTags = possibleTags.filter(tag => !photo.tags.includes(tag))
        const numTagsToAdd = Math.floor(Math.random() * 3) + 2
        const newTags = []
        
        for (let i = 0; i < numTagsToAdd && i < availableTags.length; i++) {
          const randomIndex = Math.floor(Math.random() * availableTags.length)
          newTags.push(availableTags[randomIndex])
          availableTags.splice(randomIndex, 1)
        }
        
        return {
          ...photo,
          tags: [...photo.tags, ...newTags]
        }
      }
      return photo
    }))
    
    setIsProcessing(false)
    setProcessingProgress(0)
    setProcessingType('')
    
    toast({
      title: "Auto-Tagging Complete",
      description: `Added tags to ${selectedPhotos.length} photos.`,
    })
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingType('upload')
    
    // Simulate upload and processing
    const processFiles = async () => {
      for (let i = 0; i <= 100; i += 2) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setProcessingProgress(i)
      }
      
      // Create new photo objects
      const newPhotos = Array.from(files).map((file, index) => {
        const id = `new-${Date.now()}-${index}`
        return {
          id,
          url: URL.createObjectURL(file),
          title: file.name.replace(/\.[^/.]+$/, ""),
          event: 'New Upload',
          date: new Date().toISOString().split('T')[0],
          faces: [],
          tags: ['new', 'uploaded'],
          aiSuggestions: [],
          quality: Math.floor(Math.random() * 15) + 85,
          edited: false,
          metadata: {
            dimensions: { width: 6000, height: 4000 }, // Placeholder
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          }
        }
      })
      
      setPhotos([...newPhotos, ...photos])
      setIsProcessing(false)
      setProcessingProgress(0)
      setProcessingType('')
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} photos.`,
      })
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    
    processFiles()
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
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Photos
          </Button>
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
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

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

      {/* Photo Details Dialog */}
      <Dialog open={showPhotoDetails} onOpenChange={setShowPhotoDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPhoto && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
                <DialogDescription>
                  {selectedPhoto.event} - {selectedPhoto.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Preview */}
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border">
                    <img 
                      src={selectedPhoto.url} 
                      alt={selectedPhoto.title} 
                      className="w-full h-auto"
                    />
                    
                    {/* Face indicators */}
                    {showFaces && selectedPhoto.faces.map((face) => (
                      <div 
                        key={face.id}
                        className="absolute border-2 border-green-400 rounded-sm"
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
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowFaces(!showFaces)}>
                      {showFaces ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showFaces ? "Hide Faces" : "Show Faces"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowStyleTransfer(true)}>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Apply Style
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowSmartCropping(true)}>
                      <Crop className="h-4 w-4 mr-2" />
                      Smart Crop
                    </Button>
                  </div>
                </div>
                
                {/* Photo Info */}
                <div className="space-y-6">
                  {/* Metadata */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Photo Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedPhoto.metadata?.camera && (
                        <div>
                          <span className="font-medium">Camera:</span> {selectedPhoto.metadata.camera}
                        </div>
                      )}
                      {selectedPhoto.metadata?.lens && (
                        <div>
                          <span className="font-medium">Lens:</span> {selectedPhoto.metadata.lens}
                        </div>
                      )}
                      {selectedPhoto.metadata?.aperture && (
                        <div>
                          <span className="font-medium">Aperture:</span> {selectedPhoto.metadata.aperture}
                        </div>
                      )}
                      {selectedPhoto.metadata?.shutterSpeed && (
                        <div>
                          <span className="font-medium">Shutter:</span> {selectedPhoto.metadata.shutterSpeed}
                        </div>
                      )}
                      {selectedPhoto.metadata?.iso && (
                        <div>
                          <span className="font-medium">ISO:</span> {selectedPhoto.metadata.iso}
                        </div>
                      )}
                      {selectedPhoto.metadata?.focalLength && (
                        <div>
                          <span className="font-medium">Focal Length:</span> {selectedPhoto.metadata.focalLength}
                        </div>
                      )}
                      {selectedPhoto.metadata?.dimensions && (
                        <div>
                          <span className="font-medium">Dimensions:</span> {selectedPhoto.metadata.dimensions.width} × {selectedPhoto.metadata.dimensions.height}
                        </div>
                      )}
                      {selectedPhoto.metadata?.fileSize && (
                        <div>
                          <span className="font-medium">File Size:</span> {selectedPhoto.metadata.fileSize}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* People */}
                  {selectedPhoto.faces.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">People</h3>
                      <div className="space-y-2">
                        {selectedPhoto.faces.map((face) => (
                          <div key={face.id} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{face.name}</p>
                              <p className="text-xs text-muted-foreground">{Math.round(face.confidence * 100)}% confidence</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* AI Suggestions */}
                  {selectedPhoto.aiSuggestions.length > 0 && showSuggestions && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">AI Suggestions</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {selectedPhoto.aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhancement History */}
                  {selectedPhoto.enhancementHistory && selectedPhoto.enhancementHistory.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Enhancement History</h3>
                      <div className="space-y-2">
                        {selectedPhoto.enhancementHistory.map((enhancement) => (
                          <div key={enhancement.id} className="text-sm border rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{enhancement.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(enhancement.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {enhancement.parameters && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {Object.entries(enhancement.parameters)
                                  .filter(([key, value]) => typeof value !== 'boolean' || value === true)
                                  .map(([key, value], index) => (
                                    <span key={key}>
                                      {index > 0 && ", "}
                                      {key}: {typeof value === 'boolean' ? 'yes' : value}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Style Transfer Sheet */}
      <Sheet open={showStyleTransfer} onOpenChange={setShowStyleTransfer}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Apply AI Style</SheetTitle>
            <SheetDescription>
              Transform your photo with AI-powered style presets.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Style Strength</Label>
              <div className="flex items-center justify-between">
                <span className="text-xs">Subtle</span>
                <Slider
                  min={25}
                  max={100}
                  step={5}
                  value={[aiSettings.styleTransferStrength]}
                  onValueChange={([value]) => setAiSettings({...aiSettings, styleTransferStrength: value})}
                  className="mx-4 w-[180px]"
                />
                <span className="text-xs">Strong</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {stylePresets.map((style) => (
                <div 
                  key={style.id}
                  className={`border rounded-md p-2 cursor-pointer transition-all ${selectedStyle === style.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="font-medium text-sm">{style.name}</div>
                  <div className="text-xs text-muted-foreground">{style.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <SheetFooter>
            <Button 
              onClick={handleStyleTransfer} 
              disabled={!selectedStyle || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Apply Style</>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Smart Cropping Sheet */}
      <Sheet open={showSmartCropping} onOpenChange={setShowSmartCropping}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Smart Cropping</SheetTitle>
            <SheetDescription>
              AI-powered cropping that preserves the important elements in your photo.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Cropping Priority</Label>
              <Select 
                value={aiSettings.smartCroppingPriority}
                onValueChange={(value) => setAiSettings({...aiSettings, smartCroppingPriority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faces">Prioritize Faces</SelectItem>
                  <SelectItem value="composition">Prioritize Composition</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {cropPresets.map((crop) => (
                <div 
                  key={crop.id}
                  className={`border rounded-md p-2 cursor-pointer transition-all ${selectedCrop === crop.aspectRatio ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCrop(crop.aspectRatio)}
                >
                  <div className="font-medium text-sm">{crop.name}</div>
                  <div className="text-xs text-muted-foreground">{crop.aspectRatio}</div>
                </div>
              ))}
            </div>
          </div>
          
          <SheetFooter>
            <Button 
              onClick={handleSmartCrop} 
              disabled={!selectedCrop || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Apply Crop</>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* AI Settings Dialog */}
      <Dialog open={showAISettings} onOpenChange={setShowAISettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Settings</DialogTitle>
            <DialogDescription>
              Configure AI behavior and processing options.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-tagging">Auto-Tagging</Label>
                <Switch
                  id="auto-tagging"
                  checked={aiSettings.autoTaggingEnabled}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, autoTaggingEnabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="save-originals">Save Original Photos</Label>
                <Switch
                  id="save-originals"
                  checked={aiSettings.saveOriginals}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, saveOriginals: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-organize">Auto-Organize Photos</Label>
                <Switch
                  id="auto-organize"
                  checked={aiSettings.autoOrganize}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, autoOrganize: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="suggestions">AI Suggestions</Label>
                <Switch
                  id="suggestions"
                  checked={aiSettings.suggestionsEnabled}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, suggestionsEnabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Face Recognition Threshold</Label>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Lower (more faces)</span>
                  <Slider
                    min={50}
                    max={95}
                    step={5}
                    value={[aiSettings.faceRecognitionThreshold]}
                    onValueChange={([value]) => setAiSettings({...aiSettings, faceRecognitionThreshold: value})}
                    className="mx-4 w-[180px]"
                  />
                  <span className="text-xs">Higher (more accurate)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Enhancement Level</Label>
                <Select 
                  value={aiSettings.enhancementLevel}
                  onValueChange={(value) => setAiSettings({...aiSettings, enhancementLevel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subtle">Subtle</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Processing Priority</Label>
                <Select 
                  value={aiSettings.processingPriority}
                  onValueChange={(value) => setAiSettings({...aiSettings, processingPriority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="speed">Speed</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={() => setShowAISettings(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}