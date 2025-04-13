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
  
  try {
    const savedSettings = localStorage.getItem('wedding_photography_settings')
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      // Ensure all required fields exist by merging with initialSettings
      return { ...initialSettings, ...parsedSettings }
    }
  } catch (error) {
    console.error('Error retrieving settings from localStorage:', error)
  }
  
  return initialSettings
}

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings: Settings): Settings => {
  if (typeof window !== 'undefined') {
    try {
      // Ensure all required fields exist by merging with initialSettings
      const mergedSettings = { ...initialSettings, ...settings }
      localStorage.setItem('wedding_photography_settings', JSON.stringify(mergedSettings))
      return mergedSettings
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
    }
  }
  return settings
}

/**
 * Reset settings to default values
 */
export const resetSettingsToDefault = (): Settings => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wedding_photography_settings', JSON.stringify(initialSettings))
    } catch (error) {
      console.error('Error resetting settings to default:', error)
    }
  }
  return initialSettings
}