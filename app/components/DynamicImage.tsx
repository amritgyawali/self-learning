'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getPhotosByPage } from '@/app/lib/photoService'

interface DynamicImageProps {
  page: string
  section: string
  fallbackSrc?: string
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  quality?: number
  layout?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/**
 * DynamicImage component
 * 
 * This component displays images that can be customized through the admin dashboard.
 * It fetches the appropriate image based on the page and section from the photoService.
 */
export default function DynamicImage({
  page,
  section,
  fallbackSrc = '/images/placeholder.jpg',
  alt = 'Image',
  width,
  height,
  fill,
  layout,
  objectFit = 'cover',
  className = '',
  priority = false,
  sizes,
  loading,
  quality
}: DynamicImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc)
  const [imageAlt, setImageAlt] = useState<string>(alt)
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return
    
    // Get photos for this page and section
    const photos = getPhotosByPage(page, section)
    
    // Use the first photo if available
    if (photos.length > 0) {
      setImageSrc(photos[0].imageUrl)
      setImageAlt(photos[0].altText || alt)
    }
  }, [page, section, alt])
  
  // Support both legacy 'layout="fill"' and modern 'fill' prop
  if (layout === 'fill' || fill) {
    return (
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill={true}
        sizes={sizes}
        className={`${className} ${objectFit ? `object-${objectFit}` : 'object-cover'}`}
        priority={priority}
        loading={loading}
        quality={quality}
      />
    )
  }
  
  // Otherwise use width and height
  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={width || 500}
      height={height || 300}
      className={className}
      priority={priority}
      loading={loading}
      quality={quality}
    />
  )
}