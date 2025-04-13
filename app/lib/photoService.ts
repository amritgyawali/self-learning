/**
 * Photo Service
 * 
 * This service provides functions to manage website photos.
 * It handles loading, saving, and retrieving photo data from localStorage.
 * Photos are organized by page and section for easy management and retrieval.
 */

export interface Photo {
  id: string;
  page: string;
  section: string;
  description: string;
  imageUrl: string;
  altText: string;
  lastUpdated: string;
  updatedBy: string;
}

// Initial default photos
const initialPhotos: Photo[] = [
  {
    id: '1',
    page: 'Home',
    section: 'Hero',
    description: 'Main hero image showcasing wedding photography',
    imageUrl: '/images/hero-image-1.jpg',
    altText: 'Wedding couple at sunset',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '2',
    page: 'Home',
    section: 'Gallery',
    description: 'Featured wedding photo in gallery',
    imageUrl: '/images/gallery-1.jpg',
    altText: 'Bride and groom first dance',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '3',
    page: 'Portfolio',
    section: 'Hero',
    description: 'Portfolio page hero image',
    imageUrl: '/images/portfolio-hero.jpg',
    altText: 'Wedding photography portfolio showcase',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '4',
    page: 'About Us',
    section: 'Hero',
    description: 'About us page hero image',
    imageUrl: '/images/about-us-hero.JPG',
    altText: 'Our photography team',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '5',
    page: 'Wedding Cinema',
    section: 'Hero',
    description: 'Wedding cinema page hero image',
    imageUrl: '/images/wedding-cinema-hero.jpg',
    altText: 'Wedding cinematography showcase',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '6',
    page: 'Buy Photo Albums',
    section: 'Hero',
    description: 'Photo albums page hero image',
    imageUrl: '/images/photo-albums-hero.JPG',
    altText: 'Wedding photo albums showcase',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  },
  {
    id: '7',
    page: 'Live Weddings',
    section: 'Hero',
    description: 'Live weddings page hero image',
    imageUrl: '/images/live-weddings-hero.jpg',
    altText: 'Live wedding event coverage',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: 'System'
  }
];

/**
 * Get all photos from localStorage or return defaults if none exist
 */
export const getPhotos = (): Photo[] => {
  if (typeof window === 'undefined') {
    return initialPhotos;
  }
  
  const savedPhotos = localStorage.getItem('wedding_photography_photos');
  
  if (savedPhotos) {
    try {
      return JSON.parse(savedPhotos);
    } catch (error) {
      console.error('Error parsing photos from localStorage:', error);
      return initialPhotos;
    }
  }
  
  return initialPhotos;
};

/**
 * Get photos by page and optionally by section
 */
export const getPhotosByPage = (page: string, section?: string): Photo[] => {
  const allPhotos = getPhotos();
  
  if (section) {
    return allPhotos.filter(photo => photo.page === page && photo.section === section);
  }
  
  return allPhotos.filter(photo => photo.page === page);
};

/**
 * Get a single photo by ID
 */
export const getPhotoById = (id: string): Photo | undefined => {
  const allPhotos = getPhotos();
  return allPhotos.find(photo => photo.id === id);
};

/**
 * Save all photos to localStorage
 */
export const savePhotos = (photos: Photo[]): Photo[] => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wedding_photography_photos', JSON.stringify(photos));
  }
  return photos;
};

/**
 * Add or update a photo
 */
export const savePhoto = (photo: Photo): Photo => {
  const allPhotos = getPhotos();
  const existingPhotoIndex = allPhotos.findIndex(p => p.id === photo.id);
  
  if (existingPhotoIndex >= 0) {
    // Update existing photo
    allPhotos[existingPhotoIndex] = {
      ...photo,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  } else {
    // Add new photo with generated ID if not provided
    const newPhoto = {
      ...photo,
      id: photo.id || String(Date.now()),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    allPhotos.push(newPhoto);
  }
  
  savePhotos(allPhotos);
  return photo;
};

/**
 * Delete a photo by ID
 */
export const deletePhoto = (id: string): boolean => {
  const allPhotos = getPhotos();
  const filteredPhotos = allPhotos.filter(photo => photo.id !== id);
  
  if (filteredPhotos.length < allPhotos.length) {
    savePhotos(filteredPhotos);
    return true;
  }
  
  return false;
};

/**
 * Reset photos to default values
 */
export const resetPhotosToDefault = (): Photo[] => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wedding_photography_photos', JSON.stringify(initialPhotos));
  }
  return initialPhotos;
};

/**
 * Get available pages
 */
export const getAvailablePages = (): string[] => {
  const allPhotos = getPhotos();
  const pages = new Set(allPhotos.map(photo => photo.page));
  return Array.from(pages);
};

/**
 * Get available sections for a specific page
 */
export const getAvailableSections = (page: string): string[] => {
  const pagePhotos = getPhotosByPage(page);
  const sections = new Set(pagePhotos.map(photo => photo.section));
  return Array.from(sections);
};