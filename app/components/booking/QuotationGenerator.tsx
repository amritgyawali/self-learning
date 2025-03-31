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
  defaultDays?: number;
}

export default function QuotationGenerator({
  userDetails,
  selectedServices,
  totalPrice,
}: QuotationGeneratorProps) {
  // Define all available service options
  const serviceOptions: ServiceOption[] = [
    { id: 1, name: "Drone Photography", price: 10000, description: "Aerial shots of your venue and ceremony", category: 'service', defaultDays: 1 },
    { id: 2, name: "Photo Booth", price: 7000, description: "Fun props and instant prints for your guests", category: 'service', defaultDays: 1 },
    { id: 3, name: "Additional Photographer", price: 10000, description: "Extra coverage from a second shooter", category: 'service', defaultDays: 1 },
    { id: 4, name: "Videography", price: 15000, description: "Professional video coverage of your big day", category: 'service', defaultDays: 1 },
    { id: 5, name: "Karizma Album", price: 15000, description: "Print larger Premium album", category: 'service', defaultDays: 1 },
    { id: 6, name: "Reception", price: 39000, description: "Complete coverage of your reception", category: 'package', defaultDays: 1 },
    { id: 7, name: "Haldi/Mehendi", price: 20000, description: "Coverage of your mehendi ceremony", category: 'package', defaultDays: 1 },
    { id: 8, name: "Engagement", price: 25000, description: "Coverage of your engagement ceremony", category: 'package', defaultDays: 1 },
 
  ]

  const packageOptions: ServiceOption[] = [
    { id: 9, name: "Classic Package", price: 29999, description: "8 Hours of Coverage, 1 Photographer, Online Gallery, 100 Edited Digital Images", category: 'package', defaultDays: 1 },
    { id: 10, name: "Premium Wedding Package", price: 79000, description: "Full Wedding Photo & Video, 2 Photographers ,1 Videographer, Online Gallery,Edited Digital Images,Cinematic Highlight Video,Love Story", category: 'package', defaultDays: 1 },
    { id: 11, name: "One day wedding", price: 49999, description: "Full day coverage of your wedding ceremony", category: 'package', defaultDays: 1 },
    { id: 12, name: "Both Side wedding", price: 120000, description: "Coverage for both bride and groom sides", category: 'package', defaultDays: 1 },
  ]

  // State for tracking selected options
  const [selectedOptions, setSelectedOptions] = useState<ServiceOption[]>([]);
  // State for tracking selected days for each option
  const [selectedDays, setSelectedDays] = useState<Record<number, number>>({});
  const [calculatedTotal, setCalculatedTotal] = useState(totalPrice);

  // Handle option selection
  const handleOptionToggle = (option: ServiceOption) => {
    const isSelected = selectedOptions.some(item => item.id === option.id);
    let newSelectedOptions;
    
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(item => item.id !== option.id);
      // Remove days selection when option is deselected
      const newSelectedDays = { ...selectedDays };
      delete newSelectedDays[option.id];
      setSelectedDays(newSelectedDays);
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
      // Set default days when option is selected
      setSelectedDays(prev => ({
        ...prev,
        [option.id]: option.defaultDays || 1
      }));
    }
    
    setSelectedOptions(newSelectedOptions);
    
    // Calculate new total based on selected options and their days
    updateTotalPrice(newSelectedOptions, selectedDays);
  };

  // Handle days change for an option
  const handleDaysChange = (optionId: number, days: number) => {
    const newSelectedDays = {
      ...selectedDays,
      [optionId]: days
    };
    setSelectedDays(newSelectedDays);
    
    // Update total price when days change
    updateTotalPrice(selectedOptions, newSelectedDays);
  };

  // Calculate total price based on selected options and their days
  const updateTotalPrice = (options: ServiceOption[], days: Record<number, number>) => {
    const newTotal = options.reduce((sum, item) => {
      const optionDays = days[item.id] || item.defaultDays || 1;
      return sum + (item.price * optionDays);
    }, 0);
    setCalculatedTotal(newTotal);
  };

  const generateQuotation = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add header text first (will always be visible)
    doc.setFontSize(20);
    doc.text('Wedding Photography Quotation', pageWidth / 2, 20, { align: 'center' });
    doc.text('Wedding Story Nepal', pageWidth / 2, 20, { align: 'center' });
    
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
          selectedDays[option.id] || option.defaultDays || 1,
          `Rs.${option.price.toLocaleString()}`,
          `Rs.${((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}`
        ])
      : (selectedServices as any[])?.map(service => [
          service.name,
          service.description || '',
          service.days || 1,
          `Rs.${service.price.toLocaleString()}`,
          `Rs.${((service.days || 1) * service.price).toLocaleString()}`
        ]) || [];

    // Add services table
    // Calculate total table width based on column widths
    const totalTableWidth = 40 + 70 + 20 + 30 + 30; // Sum of all column widths
    // Calculate margins to center the table
    const leftMargin = (pageWidth - totalTableWidth) / 2;
    
    autoTable(doc, {
      startY: 110,
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
        0: { cellWidth: 40 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: leftMargin, right: leftMargin }
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
    doc.text('Phone: +977-9867335830', 20, finalY + 70);
    doc.text('Email: weddingstorynepal1@gmail.com', 20, finalY + 80);

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
            <div key={option.id} className="flex flex-col p-2 border rounded hover:bg-gray-50">
              <div className="flex items-start space-x-2">
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
              
              {selectedOptions.some(item => item.id === option.id) && (
                <div className="mt-2 ml-6 flex items-center space-x-2">
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
                    Total: Rs.{((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}
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
            <div key={option.id} className="flex flex-col p-2 border rounded hover:bg-gray-50">
              <div className="flex items-start space-x-2">
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
              
              {selectedOptions.some(item => item.id === option.id) && (
                <div className="mt-2 ml-6 flex items-center space-x-2">
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
                    Total: Rs.{((selectedDays[option.id] || option.defaultDays || 1) * option.price).toLocaleString()}
                  </span>
                </div>
              )}
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