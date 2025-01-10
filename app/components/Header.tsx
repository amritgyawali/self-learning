import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isSticky ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
         <Image src="/images/logo.png" alt="Logo" width={150} height={50} />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {['Home', 'Wedding Cinema', 'Portfolio', 'About Us', 'Buy Photo Albums', 'Contact Us', 'Live Weddings'].map((item) => (
              <li key={item}>
                <Link 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-lg font-semibold hover:text-pink-500 transition-colors duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white">
          <ul className="flex flex-col items-center py-4">
            {['Home', 'Wedding Cinema', 'Portfolio', 'About Us', 'Buy Photo Albums', 'Contact Us', 'Live Weddings'].map((item) => (
              <li key={item} className="py-2">
                <Link 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-lg font-semibold hover:text-pink-500 transition-colors duration-300"
                  onClick={toggleMobileMenu}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

