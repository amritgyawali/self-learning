'use client'

import React, { useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { FaCamera, FaVideo, FaHeart, FaBook, FaPhone } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Layout from './components/Layout';
import { Button } from "@/components/ui/button"
import ContactForm from './components/ContactForm';
import { useRouter } from 'next/navigation';

// function CameraModel(props) {
//   const mesh = useRef();

//   useFrame((state, delta) => {
//     mesh.current.rotation.x += delta * 0.2;
//     mesh.current.rotation.y += delta * 0.5;
//   });

//   return (
//     <mesh {...props} ref={mesh}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   );
// }

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const images = [
    '/gallery-1.jpg',
    '/gallery-2.jpg',
    '/gallery-3.jpg',
    '/gallery-4.jpg',
    '/gallery-5.jpg',
    '/gallery-6.jpg',
    '/gallery-7.jpg',
    '/gallery-8.jpg',
    '/gallery-9.jpg',
  ];

  const testimonials = [
    {
      name: 'John & Jane Doe',
      image: '/client-1.jpg',
      rating: 5,
      text: 'Our wedding photos are absolutely stunning! The team captured every moment perfectly.',
    },
    {
      name: 'Mike & Sarah Smith',
      image: '/client-2.jpg',
      rating: 5,
      text: 'We couldn\'t be happier with our wedding video. It\'s like reliving the day all over again!',
    },
    {
      name: 'Alex & Emily Johnson',
      image: '/client-3.jpg',
      rating: 5,
      text: 'Professional, creative, and a joy to work with. Highly recommend their services!',
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="relative h-screen">
         <Image src="/images/hero-image.jpg" alt="Wedding couple" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Capture Your Special Moments
            </motion.h1>
            <motion.p
              className="text-xl mb-8 text-center"
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
              className="flex space-x-4"
            >
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => router.push('/booking')}
              >
                Book Now
              </Button>
              <Link href="tel:+9779867335830">
                <Button size="lg" className="bg-green-500 text-white hover:bg-green-600">
                  <FaPhone className="mr-2" /> Call Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 3D Model Section */}
        {/* <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Passion in 3D</h2>
            <div className="h-64 sm:h-96">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <CameraModel position={[0, 0, 0]} />
                  <Environment preset="sunset" background />
                </Suspense>
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </div>
        </section> */}

        {/* Featured Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-8 md:mb-0"
                style={{ scale }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                 <Image src="/images/featured-image.jpg" alt="Featured wedding" width={600} height={400} className="transition-transform duration-300 hover:scale-110" />
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
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((src, index) => (
                <motion.div 
                  key={index} 
                  className="relative overflow-hidden group rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Image src={src} alt={`Gallery image ${index + 1}`} width={400} height={300} className="w-full h-auto transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setPhotoIndex(index);
                        setIsLightboxOpen(true);
                      }}
                      className="text-white text-lg font-semibold hover:underline"
                    >
                      View Image
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Cards Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: FaCamera, title: 'Photography', description: 'Capture your special moments with our professional photography services.' },
                { icon: FaVideo, title: 'Videography', description: 'Create lasting memories with our cinematic wedding videos.' },
                { icon: FaHeart, title: 'Pre-Wedding Shoots', description: 'Tell your love story through beautiful pre-wedding photo sessions.' },
                { icon: FaBook, title: 'Photo Albums', description: 'Preserve your memories in stunning, high-quality photo albums.' },
              ].map((service, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <service.icon className="text-4xl text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-pink-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: 50, label: 'Cities Travelled' },
                { number: 500, label: 'Happy Couples' },
                { number: 1000, label: 'Events Covered' },
                { number: 5, label: 'Years of Experience' },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <motion.h3 
                    className="text-3xl md:text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-4">
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4">
                      <Image src={testimonial.image} alt={testimonial.name} width={60} height={60} className="rounded-full mr-4" />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.text}</p>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <ContactForm />
        {/* {isLightboxOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setIsLightboxOpen(false)}
            onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
            onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          />
        )} */}
      </motion.div>
    </Layout>
  );
};

export default HomePage;

