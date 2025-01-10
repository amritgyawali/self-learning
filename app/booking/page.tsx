'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import InitialPopup from '../components/booking/InitialPopup'
import PackagesSection from '../components/booking/PackagesSection'
import CustomizePackage from '../components/booking/CustomizePackage'
import { Button } from "@/components/ui/button"
import styles from '../styles/layout.module.css';

export default function BookingPage() {
  const [userDetails, setUserDetails] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const router = useRouter()

  const handleInitialSubmit = (data) => {
    setUserDetails(data)
  }

  const handlePackageSelect = (packageData) => {
    setSelectedPackage(packageData)
    router.push('/payment')
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 100 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`container mx-auto px-4 py-8 ${styles['main-content']}`}
      >
        <h1 className="text-4xl font-bold text-center mb-8">Book Your Wedding Photography</h1>
        
        <InitialPopup isOpen={!userDetails} onSubmit={handleInitialSubmit} />

        {userDetails && (
          <>
            <PackagesSection onPackageSelect={handlePackageSelect} />
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-8">Customize Your Package</h2>
              <CustomizePackage onCustomPackageSelect={() => router.push('/payment')} />
            </div>
          </>
        )}
      </motion.div>
    </Layout>
  )
}

