/**
 * Package Service
 * 
 * This service provides functions to manage photography packages and services.
 * It handles loading, saving, and retrieving package data from localStorage.
 */

interface ServiceOption {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: 'service' | 'package';
  defaultDays?: number;
  image?: string;
}

// Initial default packages data
const initialPackages: ServiceOption[] = [
  {
    id: 1,
    name: "Classic Package",
    price: 29999,
    description: "8 Hours of Coverage, 1 Photographer, Online Gallery, 100 Edited Digital Images",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 2,
    name: "Premium Wedding Package",
    price: 79000,
    description: "Full Wedding Photo & Video, 2 Photographers, 1 Videographer, Online Gallery, Edited Digital Images, Cinematic Highlight Video, Love Story",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 3,
    name: "One day wedding",
    price: 49999,
    description: "Full day coverage of your wedding ceremony",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 4,
    name: "Both Side wedding",
    price: 120000,
    description: "Coverage for both bride and groom sides",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 5,
    name: "Drone Photography",
    price: 10000,
    description: "Aerial shots of your venue and ceremony",
    category: 'service',
    defaultDays: 1
  },
  {
    id: 6,
    name: "Photo Booth",
    price: 7000,
    description: "Fun props and instant prints for your guests",
    category: 'service',
    defaultDays: 1
  },
  {
    id: 7,
    name: "Additional Photographer",
    price: 10000,
    description: "Extra coverage from a second shooter",
    category: 'service',
    defaultDays: 1
  },
  {
    id: 8,
    name: "Videography",
    price: 15000,
    description: "Professional video coverage of your big day",
    category: 'service',
    defaultDays: 1
  },
  {
    id: 9,
    name: "Karizma Album",
    price: 15000,
    description: "Print larger Premium album",
    category: 'service',
    defaultDays: 1
  },
  {
    id: 10,
    name: "Reception",
    price: 39000,
    description: "Complete coverage of your reception",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 11,
    name: "Haldi/Mehendi",
    price: 20000,
    description: "Coverage of your mehendi ceremony",
    category: 'package',
    defaultDays: 1
  },
  {
    id: 12,
    name: "Engagement",
    price: 25000,
    description: "Coverage of your engagement ceremony",
    category: 'package',
    defaultDays: 1
  },
];

const STORAGE_KEY = 'weddingPackages';

/**
 * Initialize packages in localStorage if they don't exist
 */
export const initializePackages = (): void => {
  if (typeof window !== 'undefined') {
    const existingPackages = localStorage.getItem(STORAGE_KEY);
    if (!existingPackages) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPackages));
    }
  }
};

/**
 * Get all packages from localStorage
 */
export const getAllPackages = (): ServiceOption[] => {
  if (typeof window !== 'undefined') {
    try {
      const packagesJson = localStorage.getItem(STORAGE_KEY);
      if (packagesJson) {
        return JSON.parse(packagesJson);
      }
    } catch (error) {
      console.error('Error getting packages:', error);
    }
  }
  return initialPackages;
};

/**
 * Get packages filtered by category
 */
export const getPackagesByCategory = (category: 'service' | 'package'): ServiceOption[] => {
  const allPackages = getAllPackages();
  return allPackages.filter(pkg => pkg.category === category);
};

/**
 * Add a new package
 */
export const addPackage = (packageData: Omit<ServiceOption, 'id'>): ServiceOption => {
  const allPackages = getAllPackages();
  const newId = allPackages.length > 0 ? Math.max(...allPackages.map(p => p.id)) + 1 : 1;
  
  const newPackage = {
    ...packageData,
    id: newId
  };
  
  const updatedPackages = [...allPackages, newPackage];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
  
  return newPackage;
};

/**
 * Update an existing package
 */
export const updatePackage = (packageData: ServiceOption): ServiceOption | null => {
  const allPackages = getAllPackages();
  const packageIndex = allPackages.findIndex(p => p.id === packageData.id);
  
  if (packageIndex === -1) {
    return null;
  }
  
  allPackages[packageIndex] = packageData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPackages));
  
  return packageData;
};

/**
 * Delete a package by ID
 */
export const deletePackage = (id: number): boolean => {
  const allPackages = getAllPackages();
  const updatedPackages = allPackages.filter(p => p.id !== id);
  
  if (updatedPackages.length === allPackages.length) {
    return false; // No package was deleted
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
  return true;
};

/**
 * Reset packages to default
 */
export const resetPackagesToDefault = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPackages));
};