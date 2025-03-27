'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Package } from '@/types';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
// Register the autoTable plugin with jsPDF

interface QuotationGeneratorProps {
  userDetails: {
    name: string;
    mobile: string;
    weddingDate: Date;
  };
  selectedServices: Package['services'];
  totalPrice: number;
}

interface ServiceOption {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: 'service' | 'package';
}

export default function QuotationGenerator({
  userDetails,
  selectedServices,
  totalPrice,
}: QuotationGeneratorProps) {
  // Define all available service options
  const serviceOptions: ServiceOption[] = [
    { id: 1, name: "Drone Photography", price: 5000, description: "Aerial shots of your venue and ceremony", category: 'service' },
    { id: 2, name: "Photo Booth", price: 7000, description: "Fun props and instant prints for your guests", category: 'service' },
    { id: 3, name: "Additional Photographer", price: 10000, description: "Extra coverage from a second shooter", category: 'service' },
    { id: 4, name: "Videography", price: 15000, description: "Professional video coverage of your big day", category: 'service' },
    { id: 5, name: "Album Upgrade", price: 8000, description: "Upgrade to a premium, larger album", category: 'service' },
  ];

  const packageOptions: ServiceOption[] = [
    { id: 6, name: "Classic Package", price: 29999, description: "8 Hours of Coverage, 1 Photographer, Online Gallery, 100 Edited Digital Images", category: 'package' },
    { id: 7, name: "Premium Package", price: 49999, description: "10 Hours of Coverage, 2 Photographers, Online Gallery, 200 Edited Digital Images, Engagement Shoot", category: 'package' },
    { id: 8, name: "One day wedding", price: 49999, description: "Full day coverage of your wedding ceremony", category: 'package' },
    { id: 9, name: "Both Side wedding", price: 70999, description: "Coverage for both bride and groom sides", category: 'package' },
    { id: 10, name: "Reception", price: 30999, description: "Complete coverage of your reception", category: 'package' },
    { id: 11, name: "Mehendi", price: 15999, description: "Coverage of your mehendi ceremony", category: 'package' },
    { id: 12, name: "Engagement", price: 15999, description: "Coverage of your engagement ceremony", category: 'package' },
  ];

  // State for tracking selected options
  const [selectedOptions, setSelectedOptions] = useState<ServiceOption[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState(totalPrice);

  // Handle option selection
  const handleOptionToggle = (option: ServiceOption) => {
    const isSelected = selectedOptions.some(item => item.id === option.id);
    let newSelectedOptions;
    
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(item => item.id !== option.id);
    } else {
      // If selecting a package, remove any other selected packages
      if (option.category === 'package') {
        newSelectedOptions = [
          ...selectedOptions.filter(item => item.category !== 'package'),
          option
        ];
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    }
    
    setSelectedOptions(newSelectedOptions);
    
    // Calculate new total
    const newTotal = newSelectedOptions.reduce((sum, item) => sum + item.price, 0);
    setCalculatedTotal(newTotal);
  };

  const generateQuotation = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add header text first (will always be visible)
    doc.setFontSize(20);
    doc.text('Wedding Photography Quotation', pageWidth / 2, 20, { align: 'center' });
    
    // Try to load logo with proper error handling
    try {
      // Use absolute path to ensure the logo is found
      const logoPath = "/images/logo.png";
      
      // Add logo at the top with 100% opacity
      // Use a complete path with the public directory as base
      doc.addImage(window.location.origin + logoPath, 'PNG', 20, 10, 50, 16.67);
      
      // Add logo as watermark with 10% opacity
      // Create a separate canvas for the watermark with reduced opacity
      const canvas = document.createElement('canvas');
      canvas.width = 300; // Set fixed dimensions for better control
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      // Create a new image for the watermark
      const watermarkImg = new Image();
      watermarkImg.src = window.location.origin + logoPath;
      
      // Set up an onload handler to ensure the image is loaded before drawing
      watermarkImg.onload = () => {
        // Draw the watermark with reduced opacity
        ctx!.globalAlpha = 0.1; // 10% opacity
        ctx!.drawImage(watermarkImg, 0, 0, 300, 100);
        const watermarkDataUrl = canvas.toDataURL("image/png");
        
        // Add watermark in the center of the page
        const watermarkWidth = 150;
        const watermarkHeight = 50;
        const x = (pageWidth - watermarkWidth) / 2;
        const y = (pageHeight - watermarkHeight) / 2;
        doc.addImage(watermarkDataUrl, 'PNG', x, y, watermarkWidth, watermarkHeight);
      };
      
      // Fallback in case image doesn't load
      watermarkImg.onerror = () => {
        console.error('Error loading watermark image');
      };
      
      // Watermark is now added in the onload handler
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Continue with the rest of the PDF generation even if logo fails
    }

    // Add customer information
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Customer Name: ${userDetails.name}`, 20, 50);
    doc.text(`Mobile Number: ${userDetails.mobile}`, 20, 60);
    doc.text(`Wedding Date: ${userDetails.weddingDate.toLocaleDateString()}`, 20, 70);

    // Add description
    doc.setFontSize(11);
    const description = 'We are honored to be considered for capturing your special moments. Our team of professional photographers and videographers will ensure that every precious moment of your wedding is beautifully preserved for generations to come.';
    const splitDescription = doc.splitTextToSize(description, pageWidth - 40);
    doc.text(splitDescription, 20, 90);

    // Prepare table data from selected options
    const tableData = selectedOptions.length > 0 
      ? selectedOptions.map(option => [
          option.name,
          option.description || '',
          `Rs.${option.price.toLocaleString()}`
        ])
      : (selectedServices as any[])?.map(service => [
          service.name,
          service.description || '',
          `Rs.${service.price.toLocaleString()}`
        ]) || [];

    // Add services table
    autoTable(doc, {
      startY: 110,
      head: [[
        { content: 'Selected Services', styles: { halign: 'left', fillColor: [41, 128, 185] } },
        { content: 'Description', styles: { halign: 'left', fillColor: [41, 128, 185] } },
        { content: 'Price', styles: { halign: 'right', fillColor: [41, 128, 185] } }
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 90 },
        2: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });

    // Add total price
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    const finalTotal = selectedOptions.length > 0 ? calculatedTotal : totalPrice;
    doc.text(`Total Price: Rs.${finalTotal.toLocaleString()}`, pageWidth - 30, finalY + 20, { align: 'right' });

    // Add note about advance payment
    doc.setFontSize(10);
    const note = 'Note: A 30% advance payment is required to confirm the booking. The remaining amount should be paid one week before the event.';
    const splitNote = doc.splitTextToSize(note, pageWidth - 40);
    doc.text(splitNote, 20, finalY + 40);

    // Add contact information
    doc.setFontSize(10);
    doc.text('For any inquiries, please contact:', 20, finalY + 60);
    doc.text('Phone: +91 98765 43210', 20, finalY + 70);
    doc.text('Email: info@weddingphotography.com', 20, finalY + 80);

    // Save the PDF
    doc.save(`Wedding_Photography_Quotation_${userDetails.name}.pdf`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Select Services for Your Quotation</h3>
      
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
                <div className="font-medium">{option.name} - Rs.{option.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </Label>
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
                <div className="font-medium">{option.name} - Rs.{option.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <div className="text-xl font-bold">Total: Rs.{calculatedTotal.toLocaleString()}</div>
        <Button
          onClick={generateQuotation}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Generate Quotation
        </Button>
      </div>
    </div>
  );
}