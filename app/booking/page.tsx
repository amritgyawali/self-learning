'use client'

import { SetStateAction, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import InitialPopup from '../components/booking/InitialPopup'
import PackagesSection from '../components/booking/PackagesSection'
import UnifiedPackageSelector from '../components/booking/UnifiedPackageSelector'
import styles from '../styles/layout.module.css'
import { Package } from '../../types'

// Define the Package type

export default function BookingPage() {
  const [userDetails, setUserDetails] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const router = useRouter()

  const handleInitialSubmit = (data: any) => {
    setUserDetails(data)
  }

  const handlePackageSelect = (packageData: Package) => {
    setSelectedPackage(packageData)
    router.push('/payment')
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`container mx-auto px-4 py-8 ${styles['main-content']} bg-white min-h-screen mt-20`}
        style={{ 
          backgroundColor: 'white',
          paddingTop: '80px' // Add extra padding to account for the fixed navbar
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Book Your Wedding Photography</h1>
        
        <InitialPopup isOpen={!userDetails} onSubmit={handleInitialSubmit} />

        {userDetails && (
          <div>
            <PackagesSection onPackageSelect={handlePackageSelect} />
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-8">Customize Your Package</h2>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl">
                  <UnifiedPackageSelector 
                    userDetails={userDetails}
                    onBookPackage={(customPackageData: Package) => {
                      setSelectedPackage(customPackageData)
                      router.push('/payment')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  )
}