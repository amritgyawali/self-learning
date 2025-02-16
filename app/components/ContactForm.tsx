'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FaWhatsapp } from 'react-icons/fa';

const ContactForm = () => {
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
    <section className="py-20 bg-pink-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-script mb-4">Contact us</h2>
            <p className="text-xl text-gray-600">We would love to hear from you.</p>
            <p className="text-gray-600">You may fill the adjoining form with your queries and we will revert to you ASAP.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="name">Your name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Your email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="phone">Your phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white"
                />
              </div>
            </div>

            <div>
              <Label>Services you are interested in *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wedding"
                    checked={formData.services.wedding}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, wedding: checked as boolean }
                      })
                    }
                  />
                  <label htmlFor="wedding">Candid wedding photography</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cinematography"
                    checked={formData.services.cinematography}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, cinematography: checked as boolean }
                      })
                    }
                  />
                  <label htmlFor="cinematography">Candid cinematography</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preWedding"
                    checked={formData.services.preWedding}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, preWedding: checked as boolean }
                      })
                    }
                  />
                  <label htmlFor="preWedding">Pre wedding shoot/Couple shoot</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="photoBooks"
                    checked={formData.services.photoBooks}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, photoBooks: checked as boolean }
                      })
                    }
                  />
                  <label htmlFor="photoBooks">Photo books and albums</label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Any message for us</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="h-32 bg-white placeholder:text-gray-400/50"
                placeholder="You can mention any special requirements, eg. on 10th Dec I want candid photography + traditional videography, on 11th Dec I want candid photography and candid cinematography."
              />
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="px-8 py-2 bg-pink-500 hover:bg-pink-600 text-white">
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
  className="fixed bottom-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 flex items-center"
  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
>
  <FaWhatsapp className="text-3xl" />
  <motion.span
    className="ml-2 text-sm"
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

