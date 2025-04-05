/**
 * Settings Service
 * 
 * This service provides functions to manage website settings.
 * It handles loading, saving, and retrieving settings data from localStorage.
 */

export interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  enableComments: boolean;
  enableBooking: boolean;
  teamEmails: string;
  teamPhoneNumbers: string;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
}

// Initial default settings
const initialSettings: Settings = {
  siteName: 'Wedding Photography',
  siteDescription: 'Capture your special moments with our professional wedding photography services.',
  contactEmail: 'info@weddingphotography.com',
  contactPhone: '+1 (123) 456-7890',
  address: '123 Wedding St, Bridal City, Country',
  enableComments: true,
  enableBooking: true,
  teamEmails: '',
  teamPhoneNumbers: '',
  enableEmailNotifications: false,
  enableSMSNotifications: false,
}

/**
 * Get all settings from localStorage or return defaults if none exist
 */
export const getSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return initialSettings
  }
  
  const savedSettings = localStorage.getItem('wedding_photography_settings')
  
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings)
    } catch (error) {
      console.error('Error parsing settings from localStorage:', error)
      return initialSettings
    }
  }
  
  return initialSettings
}

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings: Settings): Settings => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wedding_photography_settings', JSON.stringify(settings))
  }
  return settings
}

/**
 * Reset settings to default values
 */
export const resetSettingsToDefault = (): Settings => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wedding_photography_settings', JSON.stringify(initialSettings))
  }
  return initialSettings
}