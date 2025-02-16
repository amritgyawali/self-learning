'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PasswordPrompt from '../components/PasswordPrompt';

const PortfolioPage: React.FC = () => {
  interface PortfolioItem {
    id: number;
    type: string;
    src: string;
    title: string;
    url: string;
  }
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [selectedItemUrl, setSelectedItemUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // For this example, we'll use mock data
    const mockData = [
      { id: 1, type: 'image', src: '/images/gallery-1.jpg', title: 'Wedding Photo 1', url: '/portfolio/wedding-1' },
      { id: 2, type: 'image', src: '/images/gallery-2.jpg', title: 'Wedding Photo 2', url: '/portfolio/wedding-2' },
      { id: 3, type: 'video', src: '/wedding-video.mp4', title: 'Wedding Highlights', url: '/portfolio/highlights' },
      // Add more items as needed
    ];
    setPortfolioItems(mockData);
  }, []);

  const handleItemClick = (item: PortfolioItem) => {
    if (item.type === 'image') {
      setSelectedImage(item);
    } else {
      setSelectedItemUrl(item.url);
      setIsPasswordPromptOpen(true);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    setIsPasswordPromptOpen(false);
    if (password === 'admin') {
      router.push(selectedItemUrl);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="relative h-[40vh]">
         <Image src="/images/portfolio-hero.jpg" alt="Portfolio" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white">Portfolio</h1>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleItemClick(item)}
                >
                  {item.type === 'image' ? (
                    <Image src={item.src} alt={item.title} width={400} height={300} className="w-full h-64 object-cover" />
                  ) : (
                    <video src={item.src} className="w-full h-64 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="w-full h-auto"
              />
            )}
          </DialogContent>
        </Dialog>

        <PasswordPrompt
          isOpen={isPasswordPromptOpen}
          onClose={() => setIsPasswordPromptOpen(false)}
          onSubmit={handlePasswordSubmit}
        />
      </motion.div>
    </Layout>
  );
};

export default PortfolioPage;

