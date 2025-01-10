'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Wedding Photography',
    siteDescription: 'Capture your special moments with our professional wedding photography services.',
    contactEmail: 'info@weddingphotography.com',
    contactPhone: '+1 (123) 456-7890',
    address: '123 Wedding St, Photo City, PC 12345',
    enableComments: true,
    enableBooking: true,
    teamEmails: '',
    teamPhoneNumbers: '',
    enableEmailNotifications: false,
    enableSMSNotifications: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the settings to your backend
    console.log('Settings saved:', settings)
    // You can add a toast notification here to inform the user that settings were saved
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Website Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableComments">Enable Comments</Label>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={() => handleSwitchChange('enableComments')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableBooking">Enable Booking</Label>
                <Switch
                  id="enableBooking"
                  checked={settings.enableBooking}
                  onCheckedChange={() => handleSwitchChange('enableBooking')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamEmails">Team Email Addresses (comma-separated)</Label>
                <Input
                  id="teamEmails"
                  name="teamEmails"
                  value={settings.teamEmails}
                  onChange={handleChange}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamPhoneNumbers">Team Phone Numbers (comma-separated)</Label>
                <Input
                  id="teamPhoneNumbers"
                  name="teamPhoneNumbers"
                  value={settings.teamPhoneNumbers}
                  onChange={handleChange}
                  placeholder="+1234567890, +0987654321"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                <Switch
                  id="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={() => handleSwitchChange('enableEmailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableSMSNotifications">Enable SMS Notifications</Label>
                <Switch
                  id="enableSMSNotifications"
                  checked={settings.enableSMSNotifications}
                  onCheckedChange={() => handleSwitchChange('enableSMSNotifications')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  )
}

