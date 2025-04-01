'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as faceapi from '@vladmandic/face-api'
import { Camera, Upload, Check, Loader2, Wand2, Smile, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

export default function PhotoUploadPage({ params }: { params: { eventId: string } }) {
  const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', email: '' })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  })
  const [autoEnhance, setAutoEnhance] = useState(false)
  const [selectedTab, setSelectedTab] = useState('camera')
  const [faceDetected, setFaceDetected] = useState(false)
  const [shareOptions, setShareOptions] = useState({
    whatsapp: true,
    email: false,
    download: false
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoEditorRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadFaceDetectionModels()
    if (selectedTab === 'camera') {
      startCamera()
    }
  }, [selectedTab])

  const loadFaceDetectionModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ])
      toast({
        title: 'Ready!',
        description: 'AI features loaded successfully.',
      })
    } catch (error) {
      console.error('Error loading face detection models:', error)
      toast({
        title: 'Error',
        description: 'Failed to load face detection models. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      })
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        
        const dataUrl = canvasRef.current.toDataURL('image/jpeg')
        setPhotoPreview(dataUrl)
        
        // Convert data URL to File object
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        setPhoto(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }))
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size and type
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image under 10MB.',
          variant: 'destructive'
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid image file.',
          variant: 'destructive'
        })
        return
      }

      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const dataUrl = reader.result as string
        setPhotoPreview(dataUrl)

        // Analyze image quality
        const img = new Image()
        img.src = dataUrl
        await new Promise(resolve => { img.onload = resolve })

        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // Calculate image quality metrics
          let brightness = 0
          let sharpness = 0
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            brightness += (r + g + b) / 3
            if (i > 0 && i < data.length - 4) {
              sharpness += Math.abs(data[i] - data[i - 4]) // Edge detection
            }
          }
          brightness /= (data.length / 4)
          sharpness /= (data.length / 4)

          // Provide feedback based on image quality
          if (brightness < 50) {
            toast({
              title: 'Low Light Warning',
              description: 'The image appears dark. Consider using better lighting.',
              variant: 'default'
            })
          } else if (brightness > 200) {
            toast({
              title: 'Overexposure Warning',
              description: 'The image appears too bright. Consider reducing exposure.',
              variant: 'default'
            })
          }

          if (sharpness < 10) {
            toast({
              title: 'Focus Warning',
              description: 'The image appears blurry. Try taking a sharper photo.',
              variant: 'default'
            })
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const processAndUploadPhoto = async () => {
    if (!photo || !guestInfo.name || !guestInfo.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields and upload a photo.',
        variant: 'destructive'
      })
      return
    }

    if (!faceDetected) {
      toast({
        title: 'No Face Detected',
        description: 'Please ensure your face is clearly visible in the photo.',
        variant: 'destructive'
      })
      return
    }

    // Analyze photo quality
    const img = new Image()
    img.src = photoPreview
    await new Promise(resolve => { img.onload = resolve })
    
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Calculate brightness and contrast
      let brightness = 0
      let contrast = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        brightness += (r + g + b) / 3
        contrast += Math.abs(((r + g + b) / 3) - brightness)
      }
      brightness /= (data.length / 4)
      contrast /= (data.length / 4)

      // Auto-enhance if needed
      if (autoEnhance) {
        if (brightness < 100) setFilters(f => ({ ...f, brightness: f.brightness + 20 }))
        if (contrast < 50) setFilters(f => ({ ...f, contrast: f.contrast + 20 }))
      }
    }

    setIsProcessing(true)
    try {
      // Detect faces and expressions in the photo
      const img = await faceapi.bufferToImage(photo)
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()

      // Analyze expressions
      const expressions = detections[0]?.expressions
      if (expressions) {
        const dominantExpression = Object.entries(expressions)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0]
        
        toast({
          title: 'Expression Detected',
          description: `We detected a ${dominantExpression} expression in your photo!`,
        })
      }

      if (detections.length === 0) {
        toast({
          title: 'No Face Detected',
          description: 'Please ensure your face is clearly visible in the photo.',
          variant: 'destructive'
        })
        setIsProcessing(false)
        return
      }

      // Apply filters and enhancements
      if (photoEditorRef.current) {
        const ctx = photoEditorRef.current.getContext('2d')
        if (ctx) {
          ctx.filter = `
            brightness(${filters.brightness}%) 
            contrast(${filters.contrast}%) 
            saturate(${filters.saturation}%) 
            blur(${filters.blur}px)
          `
          const img = new Image()
          img.src = photoPreview
          await new Promise(resolve => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, photoEditorRef.current!.width, photoEditorRef.current!.height)
              resolve(null)
            }
          })
        }
      }

      // Create form data for upload
      const formData = new FormData()
      formData.append('photo', photo)
      formData.append('name', guestInfo.name)
      formData.append('phone', guestInfo.phone)
      formData.append('email', guestInfo.email)
      formData.append('eventId', params.eventId)
      formData.append('filters', JSON.stringify(filters))
      formData.append('shareOptions', JSON.stringify(shareOptions))

      // Upload to server
      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload photo')

      toast({
        title: 'Success!',
        description: 'Your photo has been enhanced and will be shared according to your preferences.',
      })

      // Reset form
      setGuestInfo({ name: '', phone: '', email: '' })
      setPhoto(null)
      setPhotoPreview('')
    } catch (error) {
      console.error('Error processing photo:', error)
      toast({
        title: 'Error',
        description: 'Failed to process and upload photo. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif mb-4">Capture Your Moment</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, enhance, and share your special memories
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="mt-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <Button
                  onClick={capturePhoto}
                  className="w-full mt-4"
                  disabled={!videoRef.current?.srcObject}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400" />
                    <span className="mt-2">Click to upload or drag and drop</span>
                    <span className="text-sm text-gray-500">JPG, PNG, WebP up to 10MB</span>
                  </Label>
                </div>
              </TabsContent>
            </Tabs>

            {/* Photo Preview and Editing */}
            {photoPreview && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <canvas
                    ref={photoEditorRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  {faceDetected && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                      <Smile className="mr-1 h-4 w-4" />
                      Face Detected
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Auto Enhance</Label>
                    <Switch
                      checked={autoEnhance}
                      onCheckedChange={setAutoEnhance}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Brightness</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[filters.brightness]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, brightness: value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrast</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[filters.contrast]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, contrast: value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Saturation</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[filters.saturation]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, saturation: value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guest Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Sharing Options */}
            <div className="space-y-4">
              <Label>Sharing Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-whatsapp" className="cursor-pointer">Share via WhatsApp</Label>
                  <Switch
                    id="share-whatsapp"
                    checked={shareOptions.whatsapp}
                    onCheckedChange={(checked) => setShareOptions(s => ({ ...s, whatsapp: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-email" className="cursor-pointer">Receive via Email</Label>
                  <Switch
                    id="share-email"
                    checked={shareOptions.email}
                    onCheckedChange={(checked) => setShareOptions(s => ({ ...s, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-download" className="cursor-pointer">Enable Download</Label>
                  <Switch
                    id="share-download"
                    checked={shareOptions.download}
                    onCheckedChange={(checked) => setShareOptions(s => ({ ...s, download: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button onClick={startCamera} variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Selfie
                </Button>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </div>
                  </Button>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Camera Preview */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full rounded-lg ${photoPreview ? 'hidden' : ''}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Photo Preview */}
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <Button
                    onClick={() => {
                      setPhoto(null)
                      setPhotoPreview('')
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}

              {!photoPreview && videoRef.current?.srcObject && (
                <Button onClick={capturePhoto} className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={processAndUploadPhoto}
              className="w-full"
              disabled={isProcessing || !photo || !guestInfo.name || !guestInfo.phone}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Photo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}