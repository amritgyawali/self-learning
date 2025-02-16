"use client"
import React from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import {motion} from 'framer-motion';

const AboutUsPage: React.FC = () => {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        {/* Hero Section */}
        <section className="relative h-[60vh]">
          <Image src="/images/about-us-hero.jpg" alt="About Us" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white">About Us</h1>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image src="/images/founders-image.jpg" alt="Founders" width={500} height={500} className="rounded-lg" />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-4xl font-script mb-4">Our Journey</h2>
                <p className="mb-6">
                  Founded in 2000 by Hari Krishna Gyawali, our wedding photography studio began as a passion project.
                  With a shared love for capturing life's most precious moments, we set out to create a business
                  that would allow us to do what we love while providing couples with timeless memories of their
                  special day.
                </p>
                <p>
                  Over the years, our team has grown, but our commitment to quality and personal service remains
                  unchanged. We've had the privilege of documenting hundreds of weddings, each one unique and
                  beautiful in its own way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Mission Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Mission</h2>
            <div className="max-w-3xl mx-auto">
              <p className="mb-6">
                At our core, we believe that every love story deserves to be told. Our mission is to capture the
                essence of your relationship and the joy of your wedding day in a way that is authentic, beautiful,
                and timeless. We strive to create images and films that will transport you back to those precious
                moments for years to come.
              </p>
              <p className="mb-6">
                We are committed to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Providing exceptional customer service from the first consultation to the final delivery</li>
                <li>Using state-of-the-art equipment and techniques to ensure the highest quality results</li>
                <li>Continuously improving our skills through ongoing education and training</li>
                <li>Creating a comfortable and enjoyable experience for our clients on their wedding day</li>
                <li>Delivering products that exceed our clients' expectations</li>
              </ul>
              <p>
                We're not just photographers and videographers; we're storytellers, memory-keepers, and your
                partners in preserving the most important day of your life.
              </p>
            </div>
          </div>
        </section>

        {/* Photography Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Photography</h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image src="/images/photography.jpg" alt="Photography" width={500} height={500} className="rounded-lg" />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="mb-6">
                  Photography is more than just a job for us; it's a passion. We believe that every photograph tells a story,
                  and we strive to capture the emotions, the joy, and the love that make each wedding unique. Our approach
                  is a blend of traditional and contemporary styles, ensuring that we capture both the classic moments and
                  the candid, spontaneous ones.
                </p>
                <p className="mb-6">
                  Our team of experienced photographers uses the latest equipment and techniques to create stunning images
                  that you will cherish for a lifetime. We take the time to get to know our clients, understanding their vision
                  and preferences, so that we can deliver a personalized experience that exceeds their expectations.
                </p>
                <p>
                  Whether it's the first look, the exchange of vows, or the joyous celebration with family and friends, we are
                  there to capture every moment. Our goal is to create a visual narrative that reflects the beauty and emotion
                  of your special day.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default AboutUsPage;