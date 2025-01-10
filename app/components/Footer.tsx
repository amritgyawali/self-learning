import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
           <Image src="/images/logo.png" alt="Logo" width={150} height={50} className="mb-4" />
            <p className="text-gray-400 mb-4">
              Capturing your precious moments with creativity and passion. We specialize in wedding photography and cinematography.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Wedding Cinema', path: '/wedding-cinema' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact Us', path: '/contact-us' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Wedding Photography</li>
              <li className="text-gray-400">Pre-Wedding Shoots</li>
              <li className="text-gray-400">Wedding Cinematography</li>
              <li className="text-gray-400">Photo Albums</li>
              <li className="text-gray-400">Event Coverage</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-pink-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Wedding Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-pink-500" />
                <span className="text-gray-400">+91 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-pink-500" />
                <span className="text-gray-400">info@weddingphotography.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Wedding Photography. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

