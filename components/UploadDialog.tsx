'use client'

import { useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; mobile: string; file: File }) => void
  type: 'photo' | 'video'
}

export function UploadDialog({ isOpen, onClose, onSubmit, type }: UploadDialogProps) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'gallery' | 'capture'>('gallery')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && mobile && selectedFile) {
      onSubmit({ name, mobile, file: selectedFile })
      setName('')
      setMobile('')
      setSelectedFile(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload {type === 'photo' ? 'Photo' : 'Video'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          <Tabs defaultValue="gallery" onValueChange={(v) => setUploadMethod(v as 'gallery' | 'capture')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="capture">Capture</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="gallery-upload">Choose from Gallery</Label>
                <Input
                  id="gallery-upload"
                  type="file"
                  accept={type === 'photo' ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>
            <TabsContent value="capture" className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="capture-upload">Capture {type === 'photo' ? 'Photo' : 'Video'}</Label>
                <Input
                  id="capture-upload"
                  type="file"
                  accept={type === 'photo' ? "image/*" : "video/*"}
                  capture
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>
          </Tabs>

          {selectedFile && (
            <div className="text-sm text-gray-500">
              Selected file: {selectedFile.name}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !mobile || !selectedFile}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

