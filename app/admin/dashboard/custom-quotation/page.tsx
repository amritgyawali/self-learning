'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Plus, Trash, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CustomPackage {
  id: string;
  name: string;
  description: string;
  days: number;
  price: number;
}

export default function CustomQuotationPage() {
  // Customer details state
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    mobile: '',
    email: '',
    weddingDate: new Date(),
  });

  // Custom packages state
  const [packages, setPackages] = useState<CustomPackage[]>([
    { id: '1', name: '', description: '', days: 1, price: 0 }
  ]);

  // Handle customer details change
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails({
      ...customerDetails,
      [name]: value
    });
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCustomerDetails({
        ...customerDetails,
        weddingDate: date
      });
    }
  };

  // Handle package change
  const handlePackageChange = (index: number, field: keyof CustomPackage, value: string | number) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    setPackages(updatedPackages);
  };

  // Add new package
  const addPackage = () => {
    setPackages([
      ...packages,
      { id: Date.now().toString(), name: '', description: '', days: 1, price: 0 }
    ]);
  };

  // Remove package
  const removePackage = (index: number) => {
    if (packages.length > 1) {
      const updatedPackages = packages.filter((_, i) => i !== index);
      setPackages(updatedPackages);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return packages.reduce((total, pkg) => total + (pkg.price * pkg.days), 0);
  };

  // Generate PDF quotation
  const generateQuotation = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set document properties for better appearance
    doc.setProperties({
      title: 'Wedding Photography Quotation',
      subject: 'Custom Quotation for Wedding Photography Services',
      author: 'Wedding Story Nepal',
      creator: 'Wedding Story Nepal'
    });

    // Add a subtle background color for better aesthetics
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative elements - top and bottom borders
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(10, 5, pageWidth - 10, 5); // Top border
    doc.line(10, pageHeight - 5, pageWidth - 10, pageHeight - 5); // Bottom border

    // Add header text with improved typography
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16); // Smaller font size for header
    doc.setTextColor(41, 128, 185); // Brand blue color
    doc.text('Wedding Photography Quotation', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12); // Smaller font for company name
    doc.setTextColor(70, 70, 70); // Dark gray for better readability
    doc.text('Wedding Story Nepal', pageWidth / 2, 22, { align: 'center' });
    
    // Try to load logo with proper error handling
    try {
      // Use absolute path to ensure the logo is found
      const logoPath = "/images/logo.png";
      
      // Add logo at the top with 100% opacity - smaller size to prevent overlap
      doc.addImage(window.location.origin + logoPath, 'PNG', 15, 10, 30, 10); // Reduced size
      
      // Create a repeating watermark pattern with 10% opacity
      const canvas = document.createElement('canvas');
      canvas.width = 600; // Larger canvas for better quality
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      // Create a new image for the watermark
      const watermarkImg = new Image();
      watermarkImg.src = window.location.origin + logoPath;
      
      // Set up an onload handler to ensure the image is loaded before drawing
      watermarkImg.onload = () => {
        // Create a repeating pattern of watermarks
        ctx!.globalAlpha = 0.05; // 5% opacity for subtlety
        
        // Draw multiple watermarks in a pattern
        for (let x = 0; x < canvas.width; x += 200) {
          for (let y = 0; y < canvas.height; y += 200) {
            ctx!.drawImage(watermarkImg, x, y, 150, 50);
          }
        }
        
        const watermarkDataUrl = canvas.toDataURL("image/png");
        
        // Add watermark covering the entire page
        doc.addImage(watermarkDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
        
        // Continue with the rest of the PDF generation
        finalizePDF();
      };
      
      // Fallback in case image doesn't load - continue without watermark
      watermarkImg.onerror = () => {
        console.error('Error loading watermark image');
        // Continue without watermark
        finalizePDF();
      };
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Continue with the rest of the PDF generation even if logo fails
      // Call finalizePDF after its declaration
// Move finalizePDF call after the function declaration
    }

    // Function to complete the PDF generation
    const finalizePDF = () => {
      // Add customer information with improved styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(70, 70, 70);
      doc.text('CLIENT DETAILS', 20, 40);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10); // Smaller font for better readability
      doc.setTextColor(80, 80, 80);
      
      const detailsStartY = 50;
      const detailsSpacing = 7; // Reduced spacing between lines
      
      doc.text(`Booked Date: ${new Date().toLocaleDateString()}`, 20, detailsStartY);
      doc.text(`Customer Name: ${customerDetails.name}`, 20, detailsStartY + detailsSpacing);
      doc.text(`Mobile Number: ${customerDetails.mobile}`, 20, detailsStartY + (detailsSpacing * 2));
      doc.text(`Email: ${customerDetails.email}`, 20, detailsStartY + (detailsSpacing * 3));
      doc.text(`Wedding Date: ${customerDetails.weddingDate.toLocaleDateString()}`, 20, detailsStartY + (detailsSpacing * 4));

      // Add description with improved styling
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const description = 'We are honored to be considered for capturing your special moments. Our team of professional photographers and videographers will ensure that every precious moment of your wedding is beautifully preserved for generations to come.';
      const splitDescription = doc.splitTextToSize(description, pageWidth - 40);
      doc.text(splitDescription, 20, detailsStartY + (detailsSpacing * 6));

      // Add services section title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(70, 70, 70);
      doc.text('SERVICES & PACKAGES', 20, detailsStartY + (detailsSpacing * 8));

      // Prepare table data
      const tableData = packages.map(pkg => [
        pkg.name,
        pkg.description,
        pkg.days,
        `Rs.${(pkg.days * pkg.price).toLocaleString()}`
      ]);

      // Calculate total table width based on column widths
      const totalTableWidth = 40 + 70 + 20 + 40; // Sum of all column widths
      // Calculate margins to center the table
      const leftMargin = (pageWidth - totalTableWidth) / 2;

      // Add services table with improved styling
      autoTable(doc, {
        startY: detailsStartY + (detailsSpacing * 9),
        head: [[
          { content: 'Service', styles: { halign: 'left', fillColor: [41, 128, 185] } },
          { content: 'Description', styles: { halign: 'left', fillColor: [41, 128, 185] } },
          { content: 'Days', styles: { halign: 'center', fillColor: [41, 128, 185] } },
          { content: 'Total', styles: { halign: 'right', fillColor: [41, 128, 185] } }
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [70, 70, 70]
        },
        alternateRowStyles: {
          fillColor: [245, 250, 254]
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 70 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: leftMargin, right: leftMargin }
      });

      // Add total price with improved styling
      const finalY = (doc as any).lastAutoTable?.finalY || 170;
      const totalPrice = calculateTotal();
      
      // Add a subtle box around the total
      doc.setFillColor(245, 250, 254);
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.3);
      doc.roundedRect(pageWidth - 80, finalY + 10, 60, 15, 2, 2, 'FD');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(41, 128, 185);
      doc.text('Total:', pageWidth - 75, finalY + 20);
      doc.text(`Rs.${totalPrice.toLocaleString()}`, pageWidth - 25, finalY + 20, { align: 'right' });
      
      // Add logo above Authorized Signatory text with adjusted positioning
      try {
        const logoPath = "/images/logo.png";
        // Calculate signature line width
        const signatureLineWidth = 40; // Reduced width for signature line
        // Calculate logo dimensions to fit the width of the signature line
        const logoWidth = signatureLineWidth;
        const logoHeight = logoWidth / 3; // Maintain aspect ratio
        // Position logo above the signature line with more space from total box
        const logoX = pageWidth - 30 - (logoWidth / 2); // Center aligned with signature text
        const logoY = finalY + 35; // Increased spacing from total box
        
        // Add logo at 100% opacity
        doc.addImage(window.location.origin + logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error('Error adding signature logo to PDF:', error);
      }
      
      // Add Authorized Signatory text and signature line with adjusted positioning
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(70, 70, 70);
      doc.text('Authorised Signatory', pageWidth - 30, finalY + 55, { align: 'center' });
      
      // Add a line for signature
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);
      doc.line(pageWidth - 50, finalY + 50, pageWidth - 10, finalY + 50);
      
      // Add Terms and Conditions section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text('Terms and Conditions', 20, finalY + 45);
      
      // Add terms and conditions points
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      
      const termsStartY = finalY + 55;
      const termsSpacing = 6;
      
      doc.text('1. 20% advance must be paid in advanced to book.', 20, termsStartY);
      doc.text('2. if out-of-valley then lodging ,fooding and travelling must be cared by customer.', 20, termsStartY + termsSpacing);
      doc.text('3. 50% amount should be paid before getting photos', 20, termsStartY + (termsSpacing * 2));
      doc.text('4. full amount should be paid to get all photos and videos', 20, termsStartY + (termsSpacing * 3));
      doc.text('5. Full Photos edit will complete in 15 days and Video will be completed in 30 days', 20, termsStartY + (termsSpacing * 4));

      // Add contact information with improved styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text('CONTACT US', 20, termsStartY + (termsSpacing * 5) + 15);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Phone: +977-9867335830', 20, termsStartY + (termsSpacing * 5) + 25);
      doc.text('Email: weddingstorynepal1@gmail.com', 20, termsStartY + (termsSpacing * 5) + 32);
      
      // Add a thank you message
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(41, 128, 185);
      doc.text('Thank you for choosing Wedding Story Nepal!', pageWidth / 2, termsStartY + (termsSpacing * 5) + 45, { align: 'center' });
      
      // Save the PDF
      doc.save(`Wedding_Photography_Quotation_${customerDetails.name}.pdf`);
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Custom Quotation Generator</h1>
        <p className="text-gray-600">Create personalized quotations for your clients</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleCustomerChange}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                value={customerDetails.mobile}
                onChange={handleCustomerChange}
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerDetails.email}
                onChange={handleCustomerChange}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <div className="relative">
                <DatePicker
                  selected={customerDetails.weddingDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Package Details</CardTitle>
            <Button onClick={addPackage} size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Package
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="p-4 border rounded-md relative">
                  {packages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removePackage(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`package-name-${index}`}>Package/Service Name</Label>
                      <Input
                        id={`package-name-${index}`}
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                        placeholder="Enter package name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`package-days-${index}`}>Days</Label>
                        <Input
                          id={`package-days-${index}`}
                          type="number"
                          min="1"
                          value={pkg.days}
                          onChange={(e) => handlePackageChange(index, 'days', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`package-price-${index}`}>Price (Rs.)</Label>
                        <Input
                          id={`package-price-${index}`}
                          type="number"
                          min="0"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(index, 'price', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`package-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`package-desc-${index}`}
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                      placeholder="Enter package description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {/* Total Price */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md mt-4">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-xl font-bold">Rs. {calculateTotal().toLocaleString()}</span>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={generateQuotation}
                  disabled={!customerDetails.name || !customerDetails.mobile || packages.some(p => !p.name)}
                  className="flex items-center"
                  size="lg"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Quotation PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}