import React from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';

export default function WeddingCinemaPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh]">
       <Image src="/images/wedding-cinema-hero.jpg" alt="Wedding Cinema" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white">Wedding Cinema</h1>
        </div>
      </section>
//
      {/* Introduction Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
             <Image src="/images/couple-image.jpg" alt="Happy Couple" width={500} height={500} className="rounded-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-4xl font-script mb-4">Capturing Your Love Story</h2>
              <p className="mb-6">
                Our wedding cinema service goes beyond traditional videography. We create cinematic masterpieces that
                tell your unique love story. With state-of-the-art equipment and a team of experienced
                cinematographers, we capture every emotion, every smile, and every tender moment of your special day.
              </p>
              <p>
                From the nervous excitement of getting ready to the joyous celebration at the reception, our films
                weave together the highlights of your wedding day into a beautiful narrative that you'll treasure for
                years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Work</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* How It's Done Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How We Create Your Wedding Film</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">1. Pre-Wedding Consultation</h3>
              <p>
                We meet with you to understand your vision, preferences, and the unique aspects of your love story.
                This helps us tailor our approach to create a film that truly represents you as a couple.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">2. Wedding Day Filming</h3>
              <p>
                Our experienced team uses high-end cameras and equipment to capture your day. We work discreetly,
                ensuring we don't interfere with the natural flow of events while capturing all the important moments.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">3. Post-Production Magic</h3>
              <p>
                After the wedding, our skilled editors carefully curate the footage, weaving together the best
                moments into a cohesive narrative. We color grade the film and add a soundtrack that complements the
                emotions of your day.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">4. Final Delivery</h3>
              <p>
                We present you with a beautifully crafted wedding film that tells your unique love story. You'll
                receive your film in high-definition format, ready to be cherished and shared for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

