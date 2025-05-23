'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Package } from '@/types'

const additionalServices = [
  { id: 1, name: "Drone Photography", price: 5000, description: "Aerial shots of your venue and ceremony" },
  { id: 2, name: "Photo Booth", price: 7000, description: "Fun props and instant prints for your guests" },
  { id: 3, name: "Additional Photographer", price: 10000, description: "Extra coverage from a second shooter" },
  { id: 4, name: "Videography", price: 15000, description: "Professional video coverage of your big day" },
  { id: 5, name: "Album Upgrade", price: 8000, description: "Upgrade to a premium, larger album" },
]

interface CustomizePackageProps {
  onCustomPackageSelect: (customPackageData: Package) => void
}

const CustomizePackage: React.FC<CustomizePackageProps> = ({ onCustomPackageSelect }) => {
  const [selectedServices, setSelectedServices] = useState<{ id: number; name: string; price: number; description?: string }[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  const handleServiceToggle = (service: { id: number; name: string; price: number; description?: string }) => {
    const isSelected = selectedServices.some(s => s.id === service.id)
    const newServices = isSelected
      ? selectedServices.filter(s => s.id !== service.id)
      : [...selectedServices, service]

    const newTotal = newServices.reduce((sum, s) => sum + s.price, 0)
    setSelectedServices(newServices)
    setTotalPrice(newTotal)
  }

  const handleSubmit = () => {
    onCustomPackageSelect({
      id: 0,
      name: "Custom Package",
      price: totalPrice,
      description: "Custom selected services",
      services: selectedServices,
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="space-y-4">
        {additionalServices.map((service) => (
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={selectedServices.some(s => s.id === service.id)}
              onCheckedChange={() => handleServiceToggle(service)}
            />
            <Label htmlFor={`service-${service.id}`} className="flex-grow">
              <span className="font-semibold">{service.name}</span> - RS.{service.price.toLocaleString()}
              <p className="text-sm text-gray-600">{service.description}</p>
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-xl font-bold">Total Price: RS.{totalPrice.toLocaleString()}</p>
      </div>
      <Button onClick={handleSubmit} className="mt-4">Book Custom Package</Button>
    </motion.div>
  )
}

export default CustomizePackage