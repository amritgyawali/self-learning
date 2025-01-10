'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockLiveWeddingsBackend } from '@/lib/mockLiveWeddingsBackend'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { UploadDialog } from '@/components/UploadDialog'

export default function WeddingPage() {
  const params = useParams()
  const [wedding, setWedding] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'photo' | 'video' | null>(null)

  useEffect(() => {
    fetchWedding()
  }, [])

  const fetchWedding = async () => {
    setIsLoading(true)
    try {
      const fetchedWedding = await mockLiveWeddingsBackend.getWedding(params.id)
      setWedding(fetchedWedding)
    } catch (error) {
      console.error('Failed to fetch wedding:', error)
    }
    setIsLoading(false)
  }

  const handleUploadClick = (type: 'photo' | 'video') => {
    setUploadType(type)
    setIsUploadDialogOpen(true)
  }

  const handleUploadSubmit = async ({ name, mobile, file }: { name: string; mobile: string; file: File }) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        if (uploadType === 'photo') {
          await mockLiveWeddingsBackend.addPhoto(params.id, {
            url: reader.result as string,
            uploadedBy: name,
            uploadedAt: new Date().toISOString(),
          })
        } else {
          await mockLiveWeddingsBackend.addVideo(params.id, {
            url: reader.result as string,
            uploadedBy: name,
            uploadedAt: new Date().toISOString(),
          })
        }
        fetchWedding()
        setIsUploadDialogOpen(false)
        setUploadType(null)
      } catch (error) {
        console.error(`Failed to upload ${uploadType}:`, error)
      }
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!wedding) {
    return <div>Wedding not found</div>
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-20 pb-8"> {/* Added pt-20 for proper spacing from header */}
        <h1 className="text-4xl font-bold mb-6">{wedding.title}</h1>
        <p className="text-xl text-gray-600 mb-8">Created by: {wedding.createdBy}</p>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Photos</h2>
            <Button onClick={() => handleUploadClick('photo')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wedding.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="relative h-48">
                      <Image src={photo.url} alt="Wedding photo" layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">By: {photo.uploadedBy}</p>
                    <p className="text-sm text-gray-500">{new Date(photo.uploadedAt).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Videos</h2>
            <Button onClick={() => handleUploadClick('video')}>
              <Play className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wedding.videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <video src={video.url} controls className="w-full h-48 object-cover rounded-md mb-2" />
                    <p className="text-sm text-gray-500">By: {video.uploadedBy}</p>
                    <p className="text-sm text-gray-500">{new Date(video.uploadedAt).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {uploadType && (
          <UploadDialog
            isOpen={isUploadDialogOpen}
            onClose={() => {
              setIsUploadDialogOpen(false)
              setUploadType(null)
            }}
            onSubmit={handleUploadSubmit}
            type={uploadType}
          />
        )}
      </div>
    </Layout>
  )
}

