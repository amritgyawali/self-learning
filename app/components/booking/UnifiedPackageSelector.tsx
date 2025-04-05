'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Package } from '@/types'
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'

interface ServiceOption {
  id: number
  name: string
  price: number
  description?: string
  category: 'service' | 'package'
  defaultDays?: number
}

interface UnifiedPackageSelectorProps {
  userDetails: {
    name: string
    mobile: string
    weddingDate: Date
  }
  onBookPackage: (customPackageData: Package) => void
}

const UnifiedPackageSelector: React.FC<UnifiedPackageSelectorProps> = ({ userDetails, onBookPackage }) => {
  // State for service and package options
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [packageOptions, setPackageOptions] = useState<ServiceOption[]>([])

  // Load packages using packageService on component mount
  useEffect(() => {
    const loadPackages = () => {
      try {
        // Import the packageService functions
        import('@/app/lib/packageService').then(({ getAllPackages, getPackagesByCategory }) => {
          // Get all packages using the service
          const allPackages = getAllPackages()
          
          // Split into services and packages based on category
          const services = allPackages.filter((pkg: ServiceOption) => pkg.category === 'service')
          const packages = allPackages.filter((pkg: ServiceOption) => pkg.category === 'package')
          
          setServiceOptions(services)
          setPackageOptions(packages)
        }).catch(error => {
          console.error('Error importing packageService:', error)
          // Fallback to default options if service can't be loaded
          // Fallback to default options if no packages are found in localStorage
          const defaultServices = [
            { id: 1, name: "Drone Photography", price: 10000, description: "Aerial shots of your venue and ceremony", category: 'service', defaultDays: 1 },
            { id: 2, name: "Photo Booth", price: 7000, description: "Fun props and instant prints for your guests", category: 'service', defaultDays: 1 },
            { id: 3, name: "Additional Photographer", price: 10000, description: "Extra coverage from a second shooter", category: 'service', defaultDays: 1 },
            { id: 4, name: "Videography", price: 15000, description: "Professional video coverage of your big day", category: 'service', defaultDays: 1 },
            { id: 5, name: "Karizma Album", price: 15000, description: "Print larger Premium album", category: 'service', defaultDays: 1 },
            { id: 6, name: "Reception", price: 39000, description: "Complete coverage of your reception", category: 'package', defaultDays: 1 },
            { id: 7, name: "Haldi/Mehendi", price: 20000, description: "Coverage of your mehendi ceremony", category: 'package', defaultDays: 1 },
            { id: 8, name: "Engagement", price: 25000, description: "Coverage of your engagement ceremony", category: 'package', defaultDays: 1 },
          ]
          
          const defaultPackages = [
            { id: 9, name: "Classic Package", price: 29999, description: "8 Hours of Coverage, 1 Photographer, Online Gallery, 100 Edited Digital Images", category: 'package', defaultDays: 1 },
            { id: 10, name: "Premium Wedding Package", price: 79000, description: "Full Wedding Photo & Video, 2 Photographers, 1 Videographer, Online Gallery, Edited Digital Images, Cinematic Highlight Video, Love Story", category: 'package', defaultDays: 1 },
            { id: 11, name: "One day wedding", price: 49999, description: "Full day coverage of your wedding ceremony", category: 'package', defaultDays: 1 },
            { id: 12, name: "Both Side wedding", price: 120000, description: "Coverage for both bride and groom sides", category: 'package', defaultDays: 1 },
          ]
          
          setServiceOptions(defaultServices as ServiceOption[])
          setPackageOptions(defaultPackages as ServiceOption[])
        })
      } catch (error) {
        console.error('Error loading packages:', error)
      }
    }
    
    loadPackages()
  }, [])

  // State for tracking selected options
  const [selectedOptions, setSelectedOptions] = useState<ServiceOption[]>([])
  const [calculatedTotal, setCalculatedTotal] = useState(0)
  // State for tracking selected days for each option
  const [selectedDays, setSelectedDays] = useState<Record<number, number>>({})

  // Handle option selection
  const handleOptionToggle = (option: ServiceOption) => {
    const isSelected = selectedOptions.some(item => item.id === option.id)
    let newSelectedOptions
    
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(item => item.id !== option.id)
      // Remove days selection when option is deselected
      const newSelectedDays = { ...selectedDays }
      delete newSelectedDays[option.id]
      setSelectedDays(newSelectedDays)
    } else {
      // Allow multiple selections for both packages and services
      newSelectedOptions = [...selectedOptions, option]
      
      // Set default days when option is selected
      setSelectedDays(prev => ({
        ...prev,
        [option.id]: option.defaultDays || 1
      }))
    }
    
    setSelectedOptions(newSelectedOptions)
    
    // Calculate new total based on selected options and their days
    updateTotalPrice(newSelectedOptions, selectedDays)
  }

  // Handle days change for an option
  const handleDaysChange = (optionId: number, days: number) => {
    const newSelectedDays = {
      ...selectedDays,
      [optionId]: days
    }
    setSelectedDays(newSelectedDays)
    
    // Update total price when days change
    updateTotalPrice(selectedOptions, newSelectedDays)
  }

  // Calculate total price based on selected options and their days
  const updateTotalPrice = (options: ServiceOption[], days: Record<number, number>) => {
    const newTotal = options.reduce((sum, item) => {
      const optionDays = days[item.id] || item.defaultDays || 1
      return sum + (item.price * optionDays)
    }, 0)
    setCalculatedTotal(newTotal)
  }

  const handleBookPackage = () => {
    onBookPackage({
      id: 0,
      name: "Custom Package",
      price: calculatedTotal,
      description: "Custom selected services",
      services: selectedOptions,
    })
  }

  const generateQuotation = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Function to generate the PDF content
    const generatePDFContent = (startY = 20) => {
      // Add header text
      doc.setFontSize(20)
      doc.text('Wedding Photography Quotation', pageWidth / 2, startY, { align: 'center' })
      doc.setFontSize(16)
      doc.text('Wedding Story Nepal', pageWidth / 2, startY + 10, { align: 'center' })
      
      // Add customer information
      doc.setFontSize(12)
      doc.text(`Booked Date: ${new Date().toLocaleDateString()}`, 20, startY + 20)
      doc.text(`Customer Name: ${userDetails.name}`, 20, startY + 30)
      doc.text(`Mobile Number: ${userDetails.mobile}`, 20, startY + 40)
      doc.text(`Wedding Date: ${userDetails.weddingDate.toLocaleDateString()}`, 20, startY + 50)
      
      // Add description
      doc.setFontSize(11)
      const description = 'We are honored to be considered for capturing your special moments. Our team of professional photographers and videographers will ensure that every precious moment of your wedding is beautifully preserved for generations to come.'
      const splitDescription = doc.splitTextToSize(description, pageWidth - 40)
      doc.text(splitDescription, 20, startY + 70)
      
      // Prepare table data from selected options
      const tableData = selectedOptions.map(option => [
        option.name,
        option.description || '',
        selectedDays[option.id] || option.defaultDays || 1,
        `RS.${option.price.toLocaleString()}`,
        `RS.${((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}`
      ])
      
      // Add services table
      autoTable(doc, {
        startY: startY + 90,
        head: [[
          { content: 'Selected Services', styles: { halign: 'left', fillColor: [41, 128, 185] } },
          { content: 'Description', styles: { halign: 'left', fillColor: [41, 128, 185] } },
          { content: 'Days', styles: { halign: 'center', fillColor: [41, 128, 185] } },
          { content: 'Price/Day', styles: { halign: 'right', fillColor: [41, 128, 185] } },
          { content: 'Total Price', styles: { halign: 'right', fillColor: [41, 128, 185] } }
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 50 },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: 25, right: 25 }
      })
      
      // Add total price
      const finalY = (doc as any).lastAutoTable?.finalY || (startY + 130)
      doc.text(`Total Price: RS.${calculatedTotal.toLocaleString()}`, pageWidth - 30, finalY + 20, { align: 'right' })
      
      // Add note about advance payment
      doc.setFontSize(10)
      const note = 'Note: A 30% advance payment is required to confirm the booking. The remaining amount should be paid one week before the event.'
      const splitNote = doc.splitTextToSize(note, pageWidth - 40)
      doc.text(splitNote, 20, finalY + 40)
      
      // Add contact information
      doc.setFontSize(10)
      doc.text('For any inquiries, please contact:', 20, finalY + 60)
      doc.text('Phone: +977-9867335830', 20, finalY + 70)
      doc.text('Email: weddingstorynepal1@gmail.com', 20, finalY + 80)
      
      // Save the PDF
      doc.save(`Wedding_Photography_Quotation_${userDetails.name}.pdf`)
    }
    
    // Load and add the logo
    const logoUrl = window.location.origin + '/images/logo.png'
    const img = new Image()
    
    // Set up event handlers before setting src
    img.onload = () => {
      try {
        // Calculate logo dimensions while maintaining aspect ratio (reduced to 1/3 of original size)
        const logoWidth = 30 // Reduced from 120 to 40 (1/3 of original size)
        const logoHeight = (img.height / img.width) * logoWidth
        
        // Position logo at the top left corner of the page
        const logoX = 20 // Left margin
        const logoY = 10
        
        // Add the logo to the PDF
        doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight)
        
        // Add watermark logo in the background with 20% opacity
        const watermarkSize = pageWidth * 0.7 // Large background watermark
        const watermarkX = (pageWidth - watermarkSize) / 2
        const watermarkY = (doc.internal.pageSize.getHeight() - watermarkSize) / 2
        
        // Save current global alpha/opacity
        const currentGState = doc.saveGraphicsState()
        
        // Set transparency
        doc.setGState(new (doc.GState as any)({opacity: 0.09}))
        
        // Add watermark image
        doc.addImage(img, 'PNG', watermarkX, watermarkY, watermarkSize, watermarkSize * (img.height / img.width))
        
        // Restore previous opacity
        doc.restoreGraphicsState()
        
        // Generate the rest of the PDF with adjusted starting position
        generatePDFContent(logoY + logoHeight + 10)
      } catch (error) {
        console.error('Error adding logo to PDF:', error)
        generatePDFContent()
      }
    }
    
    img.onerror = () => {
      console.error('Error loading logo image')
      // Continue with PDF generation without logo
      generatePDFContent()
    }
    
    // Set crossOrigin to handle CORS issues
    img.crossOrigin = 'Anonymous'
    // Set the source after setting up event handlers
    img.src = logoUrl
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-xl font-bold mb-4">Select Services for Your Package</h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Photography Packages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packageOptions.map((option) => (
            <div key={option.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedOptions.some(item => item.id === option.id)}
                onCheckedChange={() => handleOptionToggle(option)}
                className="mt-1"
              />
              <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                <div className="font-medium">{option.name} - RS.{option.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </Label>
              
              {selectedOptions.some(item => item.id === option.id) && (
                <div className="mt-2 flex items-center space-x-2">
                  <Label htmlFor={`days-${option.id}`} className="text-sm">Days:</Label>
                  <select
                    id={`days-${option.id}`}
                    value={selectedDays[option.id] || option.defaultDays || 1}
                    onChange={(e) => handleDaysChange(option.id, parseInt(e.target.value))}
                    className="border rounded p-1 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    Total: RS.{((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Additional Services</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceOptions.map((option) => (
            <div key={option.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedOptions.some(item => item.id === option.id)}
                onCheckedChange={() => handleOptionToggle(option)}
                className="mt-1"
              />
              <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                <div className="font-medium">{option.name} - RS.{option.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </Label>
              
              {selectedOptions.some(item => item.id === option.id) && (
                <div className="mt-2 flex items-center space-x-2">
                  <Label htmlFor={`days-${option.id}`} className="text-sm">Days:</Label>
                  <select
                    id={`days-${option.id}`}
                    value={selectedDays[option.id] || option.defaultDays || 1}
                    onChange={(e) => handleDaysChange(option.id, parseInt(e.target.value))}
                    className="border rounded p-1 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    Total: RS.{((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
        <div className="text-xl font-bold">Total: RS.{calculatedTotal.toLocaleString()}</div>
        <div className="flex gap-3">
          <Button
            onClick={handleBookPackage}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={selectedOptions.length === 0}
          >
            Book Custom Package
          </Button>
          <Button
            onClick={generateQuotation}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={selectedOptions.length === 0}
          >
            Generate Quotation
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default UnifiedPackageSelector