'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { QRCodeSVG } from 'qrcode.react'
import { Camera, Settings, Share2, Users, Wand2 } from 'lucide-react'

export default function GuestPhotoManagement() {
  const [settings, setSettings] = useState({
    faceRecognition: {
      enabled: true,
      minConfidence: 0.8,
      autoEnhance: true
    },
    sharing: {
      whatsappEnabled: true,
      emailEnabled: true,
      autoShare: true,
      messageTemplate: 'Here are your photos from the event! 📸'
    },
    qrCode: {
      enabled: true,
      size: 200,
      eventId: 'demo-event-2024'
    }
  })

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Guest Photo Management</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="face-recognition">Face Recognition</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Total Photos: 156</p>
                  <p>Today's Uploads: 23</p>
                  <p>Pending Review: 5</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guest Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Active Guests: 45</p>
                  <p>Total Uploads: 156</p>
                  <p>Shared Photos: 134</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  AI Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Face Detection Rate: 98%</p>
                  <p>Auto-Enhanced: 45</p>
                  <p>Failed Processing: 2</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="face-recognition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Face Recognition Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="face-recognition-toggle">Enable Face Recognition</Label>
                <Switch
                  id="face-recognition-toggle"
                  checked={settings.faceRecognition.enabled}
                  onCheckedChange={(checked) => 
                    handleSettingChange('faceRecognition', 'enabled', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Confidence Threshold</Label>
                <Slider
                  value={[settings.faceRecognition.minConfidence * 100]}
                  onValueChange={([value]) =>
                    handleSettingChange('faceRecognition', 'minConfidence', value / 100)
                  }
                  max={100}
                  step={1}
                />
                <p className="text-sm text-gray-500">
                  {(settings.faceRecognition.minConfidence * 100).toFixed(0)}%
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-enhance-toggle">Auto-Enhance Photos</Label>
                <Switch
                  id="auto-enhance-toggle"
                  checked={settings.faceRecognition.autoEnhance}
                  onCheckedChange={(checked) =>
                    handleSettingChange('faceRecognition', 'autoEnhance', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sharing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-toggle">Enable WhatsApp Sharing</Label>
                <Switch
                  id="whatsapp-toggle"
                  checked={settings.sharing.whatsappEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange('sharing', 'whatsappEnabled', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-toggle">Enable Email Sharing</Label>
                <Switch
                  id="email-toggle"
                  checked={settings.sharing.emailEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange('sharing', 'emailEnabled', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-share-toggle">Auto-Share Photos</Label>
                <Switch
                  id="auto-share-toggle"
                  checked={settings.sharing.autoShare}
                  onCheckedChange={(checked) =>
                    handleSettingChange('sharing', 'autoShare', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-template">Message Template</Label>
                <Input
                  id="message-template"
                  value={settings.sharing.messageTemplate}
                  onChange={(e) =>
                    handleSettingChange('sharing', 'messageTemplate', e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="qr-toggle">Enable QR Code</Label>
                <Switch
                  id="qr-toggle"
                  checked={settings.qrCode.enabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange('qrCode', 'enabled', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>QR Code Size</Label>
                <Slider
                  value={[settings.qrCode.size]}
                  onValueChange={([value]) =>
                    handleSettingChange('qrCode', 'size', value)
                  }
                  min={100}
                  max={400}
                  step={10}
                />
                <p className="text-sm text-gray-500">{settings.qrCode.size}px</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-id">Event ID</Label>
                <Input
                  id="event-id"
                  value={settings.qrCode.eventId}
                  onChange={(e) =>
                    handleSettingChange('qrCode', 'eventId', e.target.value)
                  }
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/live-weddings/guest-photos/upload/${settings.qrCode.eventId}`}
                    size={settings.qrCode.size}
                    level="H"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}