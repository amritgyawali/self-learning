'use client'

import React from 'react';
import Image from 'next/image';
import DynamicImage from './components/DynamicImage';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaCamera, FaVideo, FaHeart, FaBook, FaPhone } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Layout from './components/Layout';
import { Button } from "@/components/ui/button"
import ContactForm from './components/ContactForm';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';



interface Testimonial {
  name: string;
  image: string;
  rating: number;
  text: string;
}

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const images = [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
    '/images/gallery-7.jpg',
    '/images/gallery-8.jpg',
    '/images/gallery-9.jpg',
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'John & Jane Doe',
      image: '/images/gallery-2.jpg',
      rating: 5,
      text: 'Our wedding photos are absolutely stunning! The team captured every moment perfectly.',
    },
    {
      name: 'Mike & Sarah Smith',
      image: '/images/gallery-1.jpg',
      rating: 5,
      text: 'We couldn\'t be happier with our wedding video. It\'s like reliving the day all over again!',
    },
    {
      name: 'Alex & Emily Johnson',
      image: '/images/gallery-3.jpg',
      rating: 5,
      text: 'Professional, creative, and a joy to work with. Highly recommend their services!',
    },
  ];

  const services: Service[] = [
    { icon: FaCamera, title: 'Photography', description: 'Capture your special moments with our professional photography services.' },
    { icon: FaVideo, title: 'Videography', description: 'Create lasting memories with our cinematic wedding videos.' },
    { icon: FaHeart, title: 'Pre-Wedding Shoots', description: 'Tell your love story through beautiful pre-wedding photo sessions.' },
    { icon: FaBook, title: 'Photo Albums', description: 'Preserve your memories in stunning, high-quality photo albums.' },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="relative h-[80vh] sm:h-[90vh] md:h-screen">
          {/* Fixed content overlay */}
          <div className="absolute inset-0 z-10 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4 py-6">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Capture Your Special Moments
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 text-center max-w-md sm:max-w-lg md:max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Professional Wedding Photography Services
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md"
            >
              <Button
                size="default"
                className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto text-sm sm:text-base py-2 px-4"
                onClick={() => router.push('/booking')}
              >
                Book Now
              </Button>
              <Link href="tel:+9779867335830" className="w-full sm:w-auto">
                <Button
                  size="default"
                  className="bg-green-500 text-white hover:bg-green-600 w-full text-sm sm:text-base py-2 px-4"
                >
                  <FaPhone className="mr-2" /> Call Us
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Sliding background images */}
          <Slider
            dots={true}
            infinite={true}
            speed={1000}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={4000}
            className="h-full"
            arrows={false}
          >
            {[
              { id: 1, section: 'Hero-Slide-1' },
              { id: 2, section: 'Hero-Slide-2' },
              { id: 3, section: 'Hero-Slide-3' },
              { id: 4, section: 'Hero-Slide-4' },
              { id: 5, section: 'Hero-Slide-5' },
              { id: 6, section: 'Hero-Slide-6' },
              { id: 7, section: 'Hero-Slide-7' },
            ].map((slide, index) => (
              <div key={index} className="relative h-[80vh] sm:h-[90vh] md:h-screen">
                <DynamicImage
                  page="Home"
                  section={slide.section}
                  fallbackSrc={`/images/hero-image-${index + 1}.jpg`}
                  alt={`Hero Slide ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={80}
                  className="absolute object-cover"
                />
              </div>
            ))}
          </Slider>
        </section>

        {/* Featured Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-8 md:mb-0"
                style={{ scale }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                 <DynamicImage 
                  page="Home"
                  section="Featured"
                  fallbackSrc="/images/featured-image.jpg"  
                  alt="Featured wedding" 
                  width={1920} 
                  height={1080} 
                  quality={85}
                  loading="eager"
                  className="transition-transform duration-300 hover:scale-110 w-full h-full object-cover" 
                 />
                </div>
              </motion.div>
              <div className="md:w-1/2 md:pl-12">
                <motion.h2 
                  className="text-3xl md:text-4xl font-script mb-4"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Our Passion
                </motion.h2>
                <motion.p 
                  className="mb-6"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  We believe that every love story is unique and deserves to be told in its own special way. Our team of skilled photographers and cinematographers are dedicated to capturing the essence of your special day, creating timeless memories that you'll cherish for a lifetime.
                </motion.p>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <Link href="/about-us" className="text-pink-500 hover:text-pink-600 transition-colors duration-300 hover:underline">
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Our Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {images.map((src, index) => (
                <motion.div 
                  key={index} 
                  className="relative overflow-hidden group rounded-lg shadow-lg aspect-[4/3]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <DynamicImage 
                    page="Home"
                    section={`Gallery-${index + 1}`}
                    fallbackSrc={src}
                    alt={`Gallery image ${index + 1}`} 
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="transition-transform duration-300 group-hover:scale-110 object-cover" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-white text-base sm:text-lg font-semibold hover:underline px-3 py-1.5 bg-black bg-opacity-50 rounded-md">
                          View Larger
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-2 sm:p-4">
                        <DialogHeader>
                          <DialogTitle className="text-lg sm:text-xl">Gallery Image</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-video w-full">
                          <Image 
                            src={src} 
                            alt={`Gallery image ${index + 1}`} 
                            fill 
                            className="object-contain" 
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 70vw"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Cards Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <service.icon className="text-3xl sm:text-4xl text-pink-500 mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{service.title}</h3>
                  <p className="text-sm sm:text-base">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-pink-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                { number: 50, label: 'Cities Travelled' },
                { number: 500, label: 'Happy Couples' },
                { number: 1000, label: 'Events Covered' },
                { number: 5, label: 'Years of Experience' },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center py-3 sm:py-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <motion.h3 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-sm sm:text-base">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">What Our Clients Say</h2>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
              arrows={false}
              className="mb-4"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-2 sm:px-4">
                  <motion.div 
                    className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        width={50} 
                        height={50} 
                        loading="lazy"
                        quality={70}
                        className="rounded-full mr-3 sm:mr-4 w-10 h-10 sm:w-[50px] sm:h-[50px]" 
                      />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{testimonial.name}</h3>
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">{testimonial.text}</p>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <ContactForm />
      </motion.div>
    </Layout>
  );
};

export default HomePage;

