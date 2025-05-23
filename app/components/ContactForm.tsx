'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FaWhatsapp } from 'react-icons/fa';
import { useIsMobile } from "@/hooks/use-mobile";

const ContactForm = () => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: {
      wedding: false,
      cinematography: false,
      preWedding: false,
      photoBooks: false
    },
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-10 sm:py-12 md:py-20 bg-pink-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-script mb-2 sm:mb-3 md:mb-4">Contact us</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-1 sm:mb-2">We would love to hear from you.</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">You may fill the adjoining form with your queries and we will revert to you ASAP.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg shadow-sm"
          >
            <div>
              <Label htmlFor="name" className="text-sm sm:text-base mb-1 sm:mb-1.5 block font-medium">Your name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white h-10 sm:h-12 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base mb-1 sm:mb-1.5 block font-medium">Your email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white h-10 sm:h-12 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 w-full"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base mb-1 sm:mb-1.5 block font-medium">Your phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white h-10 sm:h-12 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 w-full"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm sm:text-base mb-1 sm:mb-1.5 block font-medium">Services you are interested in *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-1 sm:mt-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="wedding"
                    checked={formData.services.wedding}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, wedding: checked as boolean }
                      })
                    }
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label htmlFor="wedding" className="text-xs sm:text-sm md:text-base cursor-pointer">Candid wedding photography</label>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="cinematography"
                    checked={formData.services.cinematography}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, cinematography: checked as boolean }
                      })
                    }
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label htmlFor="cinematography" className="text-xs sm:text-sm md:text-base cursor-pointer">Candid cinematography</label>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="preWedding"
                    checked={formData.services.preWedding}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, preWedding: checked as boolean }
                      })
                    }
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label htmlFor="preWedding" className="text-xs sm:text-sm md:text-base cursor-pointer">Pre wedding shoot/Couple shoot</label>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="photoBooks"
                    checked={formData.services.photoBooks}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, photoBooks: checked as boolean }
                      })
                    }
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label htmlFor="photoBooks" className="text-xs sm:text-sm md:text-base cursor-pointer">Photo books and albums</label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm sm:text-base mb-1 sm:mb-1.5 block font-medium">Any message for us</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="h-24 sm:h-32 bg-white placeholder:text-gray-400/50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 w-full min-h-[100px] sm:min-h-[120px]"
                placeholder="You can mention any special requirements..."
              />
            </div>

            <div className="flex justify-center pt-2 sm:pt-4">
              <Button 
                type="submit" 
                className="px-6 sm:px-8 py-2 h-10 sm:h-12 bg-pink-500 hover:bg-pink-600 text-white text-sm sm:text-base min-w-[120px] sm:min-w-[150px] rounded-md"
              >
                SUBMIT
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/+9779867335830"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 bg-green-500 text-white px-2 sm:px-3 md:px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 flex items-center"
        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <FaWhatsapp className="text-xl sm:text-2xl md:text-3xl" />
        <motion.span
          className="ml-1 sm:ml-2 text-xs sm:text-sm hidden sm:inline"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          WhatsApp Us
        </motion.span>
      </motion.a>
    </section>
  );
};

export default ContactForm;

