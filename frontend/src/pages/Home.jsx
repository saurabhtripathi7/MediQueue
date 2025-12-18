import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { motion } from 'framer-motion' // Optional: for smooth entry

const Home = () => {
  return (
    // 1. Motion Wrapper for smooth page load
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 min-h-screen" // Ensure dark mode background
    >
      
      {/* Header usually looks best full-width or with its own constraint */}
      <Header/>

      {/* 2. Main Content Container 
          - max-w-7xl: Prevents content from getting too wide on huge screens.
          - mx-auto: Centers the container.
          - space-y-20: Adds consistent vertical breathing room between sections.
      */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-20 pb-20">
        
        <section>
           <SpecialityMenu/>
        </section>
        
        <section>
           <TopDoctors/>
        </section>
        
        <section>
           <Banner/>
        </section>

      </div>
    </motion.div>
  )
}

export default Home