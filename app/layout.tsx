import React from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import '@/app/styles/globals.css';
import './globals.css';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Wedding Photography',
  description: 'Capture your special moments with our professional wedding photography services.',
};

// Initialize packages in localStorage when the app starts
import { initializePackages } from './lib/packageService'

// Check if we're on the client side before initializing
if (typeof window !== 'undefined') {
  initializePackages()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} ${playfair.variable} font-sans w-full overflow-x-hidden max-w-[100vw]`}>{children}</body>
    </html>
  );
}
