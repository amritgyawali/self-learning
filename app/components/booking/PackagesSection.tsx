'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const packages = [
  {
    id: 1,
    name: "Classic Package",
    price: 29999,
    image: "/classic-package.jpg",
    services: [
      "8 Hours of Coverage",
      "1 Photographer",
      "Online Gallery",
      "100 Edited Digital Images",
    ]
  },
  {
    id: 2,
    name: "Premium Package",
    price: 49999,
    image: "/premium-package.jpg",
    services: [
      "10 Hours of Coverage",
      "2 Photographers",
      "Online Gallery",
      "200 Edited Digital Images",
      "Engagement Shoot",
    ]
  },
  {
    id: 3,
    name: "Luxury Package",
    price: 79999,
    image: "/luxury-package.jpg",
    services: [
      "Full Day Coverage",
      "2 Photographers",
      "Online Gallery",
      "All Edited Digital Images",
      "Engagement Shoot",
      "Wedding Album",
    ]
  },
  {
    id: 4,
    name: "Destination Package",
    price: 99999,
    image: "/destination-package.jpg",
    services: [
      "2 Days of Coverage",
      "2 Photographers",
      "Online Gallery",
      "All Edited Digital Images",
      "Engagement Shoot",
      "Wedding Album",
      "Travel Included",
    ]
  },
  {
    id: 5,
    name: "Ultimate Package",
    price: 149999,
    image: "/ultimate-package.jpg",
    services: [
      "3 Days of Coverage",
      "3 Photographers",
      "Online Gallery",
      "All Edited Digital Images",
      "Engagement Shoot",
      "Wedding Album",
      "Video Highlights",
      "Drone Coverage",
    ]
  },
]

export default function PackagesSection({ onPackageSelect }) {
  //const [selectedPackage, setSelectedPackage] = useState(null) //Removed as not used

  //const handleViewDetails = (pkg) => { //Removed as not used
  //  setSelectedPackage(pkg)
  //}

  //const handleCloseDialog = () => { //Removed as not used
  //  setSelectedPackage(null)
  //}

  //const handleBookPackage = () => { //Removed as not used
  //  onPackageSelect(selectedPackage)
  //  setSelectedPackage(null)
  //}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-3xl font-bold text-center mb-6">Choose Your Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image src={pkg.image} alt={pkg.name} width={400} height={300} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">₹{pkg.price.toLocaleString()}</p>
              <ul className="list-disc pl-5 mb-4">
                {pkg.services.map((service, index) => (
                  <li key={index} className="text-sm text-gray-600">{service}</li>
                ))}
              </ul>
              <Button onClick={() => onPackageSelect(pkg)} className="w-full">Book This Package</Button>
            </div>
          </motion.div>
        ))}
      </div>
      {/*Removed Dialog component as it's no longer needed*/}
    </motion.div>
  )
}

