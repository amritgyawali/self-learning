'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ContactImage from '@/public/images/wedding-cinema-hero.jpg'

const ContactPage = () => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: {
      candid: false,
      cinematography: false,
      preWedding: false,
      photoBooks: false
    },
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const faqs = [
    {
      question: "HOW BIG IS YOUR TEAM?",
      answer: "Our core team consists of 5 members: two lead photographers and three cinematographers. For larger events, we have a network of skilled associates that we can count on to provide the same level of quality and service."
    },
    {
      question: "HOW LONG HAVE YOU BEEN CAPTURING WEDDINGS?",
      answer: "We started our first wedding in the October of 2010 in Pune, India and since then it's purely fun stories. A journey that started with one camera and one lens has now turned into a beautiful experience of capturing countless love stories."
    },
    {
      question: "WHICH CAMERAS/EQUIPMENT DO YOU USE?",
      answer: "We use Sony A7R IV, Sony A7 IV, Canon 5D/7D mark-3 and 70-200 lens. Throughout our candid photography and cinematography work, we use various tools & gadgets, more specifically: drones, handheld video sliders, 70-200 lens, 24-70 lens, 50mm & 85mm prime lenses, multiple video lights, etc."
    },
    {
      question: "HOW MUCH DO YOU CHARGE?",
      answer: "Our rates are totally flexible and depend on your photography requirements. We believe in providing value for money while ensuring we capture every detail of your special day."
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]">
        <Image
          src={ContactImage}
          alt="Contact Us"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white px-4 text-center">CONTACT US</h1>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden h-[250px] sm:h-[300px] md:h-[400px]">
              <iframe
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Wedding%20Story%20Nepal%20butwal&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps - Wedding Story Nepal"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 py-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif mb-2">Our Locations</h3>
                <p className="text-gray-600 text-sm sm:text-base">We're based in Butwal and Kathmandu in Nepal.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-base sm:text-lg">KATHMANDU</h4>
                <p className="text-gray-600 text-sm sm:text-base">Near KamalPokhari</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-base sm:text-lg">BUTWAL</h4>
                <p className="text-gray-600 text-sm sm:text-base">Near Gautam Buddha Heart Hospital, Ramnagar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-10 sm:py-16 bg-[#f8d7d9]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-2 sm:mb-4">Contact us</h2>
              <p className="text-gray-700 text-sm sm:text-base">Fill up the form or pick up a phone and call!</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="name" className="text-base mb-1.5 block">Your name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white h-12 sm:h-10 text-base px-4 py-3 sm:py-2 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base mb-1.5 block">Your email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white h-12 sm:h-10 text-base px-4 py-3 sm:py-2 w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-base mb-1.5 block">Your phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white h-12 sm:h-10 text-base px-4 py-3 sm:py-2 w-full"
                />
              </div>

              <div>
                <Label className="text-base mb-1.5 block">Services you are interested in *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-2">
                  {[
                    { id: 'candid', label: 'Candid wedding photography' },
                    { id: 'cinematography', label: 'Candid cinematography' },
                    { id: 'preWedding', label: 'Pre wedding shoot' },
                    { id: 'photoBooks', label: 'Photo books and albums' }
                  ].map(service => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={formData.services[service.id as keyof typeof formData.services]}
                        onCheckedChange={(checked) => 
                          setFormData({ 
                            ...formData, 
                            services: { ...formData.services, [service.id]: checked as boolean } 
                          })
                        }
                        className="h-5 w-5"
                      />
                      <label htmlFor={service.id} className="text-base cursor-pointer">{service.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-base mb-1.5 block">Any message for us</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="h-32 bg-white text-base px-4 py-3 w-full min-h-[120px]"
                  placeholder="Tell us about your wedding plans..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 h-12 sm:h-10 text-base rounded-md"
              >
                Submit
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-8 sm:mb-12">Common questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-serif text-sm sm:text-base py-3 px-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base px-2 py-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Have More Questions Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif mb-3 sm:mb-4">HAVE MORE QUESTIONS?</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            For detailed FAQs, please visit our FAQ page. Click here to get redirected.
          </p>
        </div>
      </section>
    </Layout>
  )
}

export default ContactPage

