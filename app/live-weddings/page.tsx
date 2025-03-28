'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Camera, Video, Heart, Calendar, QrCode, Upload } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLiveWeddingsBackend } from '@/lib/mockLiveWeddingsBackend'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NameInputDialog } from '@/app/components/NameInputDialog'
import Layout from '../components/Layout'
import Image from 'next/image'
import styles from '../styles/layout.module.css';

type Wedding = {
  id: string;
  title: string;
  createdBy: string;
  photos: { url: string }[];
  videos: { url: string }[];
};

export default function LiveWeddingsPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newWeddingTitle, setNewWeddingTitle] = useState('')
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)
  const [featuredWedding, setFeaturedWedding] = useState<Wedding | null>(null)

  useEffect(() => {
    fetchWeddings()
  }, [])

  const fetchWeddings = async () => {
    setIsLoading(true)
    try {
      const fetchedWeddings = await mockLiveWeddingsBackend.getWeddings()
      setWeddings(fetchedWeddings)
      setFeaturedWedding(fetchedWeddings[0]) // Set the first wedding as featured
    } catch (error) {
      console.error('Failed to fetch weddings:', error)
    }
    setIsLoading(false)
  }

  const handleAddWedding = async () => {
    setIsNameDialogOpen(true)
  }

  const handleNameSubmit = async (name: string) => {
    setIsNameDialogOpen(false)
    try {
      await mockLiveWeddingsBackend.addWedding(newWeddingTitle, name)
      setNewWeddingTitle('')
      fetchWeddings()
    } catch (error) {
      console.error('Failed to add wedding:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-8 ${styles['main-content']}`}>
        {/* Hero Section */}
        <section className="relative h-[50vh] mb-12">
         <Image src="/images/live-weddings-hero.jpg" alt="Live Weddings" layout="fill" objectFit="cover" className="rounded-xl" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Live Weddings</h1>
              <p className="text-xl text-white mb-8">Experience the magic of weddings in real-time</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your Wedding
                  </Button>
                </DialogTrigger>
                <DialogContent className='bg-white'>
                  <DialogHeader>
                    <DialogTitle>Add New Wedding</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="weddingTitle"
                        value={newWeddingTitle}
                        onChange={(e) => setNewWeddingTitle(e.target.value)}
                        placeholder="Enter wedding title"
                        className="col-span-3"
                      />
                      <Button onClick={handleAddWedding}>Add</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Featured Wedding Section */}
        {featuredWedding && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Wedding</h2>
            <Card className="overflow-hidden">
              <div className="relative h-[300px]">
                <Image src={featuredWedding.photos[0]?.url || "/placeholder-wedding.jpg"} alt={featuredWedding.title} layout="fill" objectFit="cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{featuredWedding.title}</h3>
                <p className="text-gray-600 mb-4">Created by: {featuredWedding.createdBy}</p>
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-pink-500" />
                    <span>{featuredWedding.photos.length} Photos</span>
                  </div>
                  <div className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-pink-500" />
                    <span>{featuredWedding.videos.length} Videos</span>
                  </div>
                </div>
                <Link href={`/live-weddings/${featuredWedding.id}`}>
                  <Button className="w-full">View Wedding</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        )}

        {/* All Weddings Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">All Weddings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding, index) => (
              <motion.div
                key={wedding.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="relative h-[200px]">
                    <Image src={wedding.photos[0]?.url || "/placeholder-wedding.jpg"} alt={wedding.title} layout="fill" objectFit="cover" />
                  </div>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="mb-2">{wedding.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-4">Created by: {wedding.createdBy}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-1 text-pink-500" />
                        <span className="text-sm">{wedding.photos.length}</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-1 text-pink-500" />
                        <span className="text-sm">{wedding.videos.length}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-pink-500" />
                        <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-pink-500" />
                        <span className="text-sm">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/live-weddings/${wedding.id}`}>
                      <Button className="w-full">View Wedding</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/live-weddings/guest-photos" className="no-underline">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Guest Photos</h3>
                  <p className="text-gray-600">View and manage photos shared by your guests</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/live-weddings/guest-photos" className="no-underline">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">QR Code</h3>
                  <p className="text-gray-600">Generate QR codes for easy photo sharing</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/live-weddings/guest-photos/upload" className="no-underline">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
                  <p className="text-gray-600">Share your wedding moments with everyone</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Create Your Wedding", description: "Set up your wedding page with all the details.", icon: Plus },
              { title: "Share with Guests", description: "Invite your guests to view and contribute to your wedding page.", icon: Heart },
              { title: "Capture Memories", description: "Collect photos and videos from your special day in real-time.", icon: Camera },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <step.icon className="w-8 h-8 text-pink-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <NameInputDialog
        isOpen={isNameDialogOpen}
        onClose={() => setIsNameDialogOpen(false)}
        onSubmit={handleNameSubmit}
      />
    </Layout>
  )
}

