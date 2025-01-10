'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const additionalServices = [
  { id: 1, name: "Drone Photography", price: 5000, description: "Aerial shots of your venue and ceremony" },
  { id: 2, name: "Photo Booth", price: 7000, description: "Fun props and instant prints for your guests" },
  { id: 3, name: "Additional Photographer", price: 10000, description: "Extra coverage from a second shooter" },
  { id: 4, name: "Videography", price: 15000, description: "Professional video coverage of your big day" },
  { id: 5, name: "Album Upgrade", price: 8000, description: "Upgrade to a premium, larger album" },
]

export default function CustomizePackage() {
  const [selectedServices, setSelectedServices] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const router = useRouter()

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const newServices = prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
      
      const newTotal = newServices.reduce((sum, s) => sum + s.price, 0)
      setTotalPrice(newTotal)
      
      return newServices
    })
  }

  const handleSubmit = () => {
    // Redirect to payment gateway
    router.push('/payment')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        {additionalServices.map((service) => (
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={selectedServices.some(s => s.id === service.id)}
              onCheckedChange={() => handleServiceToggle(service)}
            />
            <Label htmlFor={`service-${service.id}`} className="flex-grow">
              <span className="font-semibold">{service.name}</span> - ₹{service.price.toLocaleString()}
              <p className="text-sm text-gray-600">{service.description}</p>
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-xl font-bold">Total Price: ₹{totalPrice.toLocaleString()}</p>
      </div>
      <Button onClick={handleSubmit} className="mt-4">Book Custom Package</Button>
    </motion.div>
  )
}

