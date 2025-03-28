'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Camera, Upload, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function GuestPhotosPage() {
  const [eventId] = useState('demo-event-2024') // In production, this would come from the event details
  const qrValue = `${process.env.NEXT_PUBLIC_BASE_URL}/live-weddings/guest-photos/upload/${eventId}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif mb-4">Guest Photo Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Capture and share your moments instantly</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Camera className="h-12 w-12 mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Step 1: Scan QR Code</h2>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
<QRCodeSVG value={qrValue} size={200} level="H" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Scan this QR code to access the photo upload page
              </p>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Upload className="h-12 w-12 mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Step 2: Upload Photos</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Guests can easily upload their selfies and photos through a simple interface
              </p>
              <Button className="mt-4" variant="outline">
                View Uploads
              </Button>
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Share2 className="h-12 w-12 mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Step 3: Share Instantly</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Photos are automatically processed and shared with guests via WhatsApp
              </p>
              <Button className="mt-4" variant="outline">
                Manage Sharing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}