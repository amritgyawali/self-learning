"use client"
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const updateMenuBarHeight = () => {
      const menuBar = document.querySelector('header');
      if (menuBar) {
        document.documentElement.style.setProperty('--menu-bar-height', `${menuBar.offsetHeight}px`);
      }
    };

    updateMenuBarHeight();
    window.addEventListener('resize', updateMenuBarHeight);

    return () => {
      window.removeEventListener('resize', updateMenuBarHeight);
    };
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;

