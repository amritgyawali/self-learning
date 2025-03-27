'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Package } from '@/types'; // Update with the actual path

interface PackagesSectionProps {
  onPackageSelect: (pkg: Package) => void;
}

const packages: Package[] = [
  {
    id: 1,
    name: "Classic Package",
    price: 29999,
    image: "/classic-package.jpg",
    services: [
      "8 Hours of Coverage",
      "1 Photographer",
      "Online Gallery",
      "100 Edited Digital Images",
    ],
  },
  {
    id: 2,
    name: "Premium Package",
    price: 49999,
    image: "/premium-package.jpg",
    services: [
      "10 Hours of Coverage",
      "2 Photographers",
      "Online Gallery",
      "200 Edited Digital Images",
      "Engagement Shoot",
    ],
  },
  // Add other packages similarly...
];

export default function PackagesSection({ onPackageSelect }: PackagesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-3xl font-bold text-center mb-6">Choose Your Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image src={pkg.image!} alt={pkg.name} width={400} height={300} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">RS.{pkg.price.toLocaleString()}</p>
              <ul className="list-disc pl-5 mb-4">
                {(pkg.services as string[]).map((service, index) => (
                  <li key={index} className="text-sm text-gray-600">{service}</li>
                ))}
              </ul>
              <Button onClick={() => onPackageSelect(pkg)} className="w-full">Book This Package</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
