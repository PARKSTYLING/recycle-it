import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { localization, type Locale } from '../lib/localization';

interface PreStartScreenProps {
  onContinue: () => void;
  currentLocale: Locale;
}

export const PreStartScreen: React.FC<PreStartScreenProps> = ({
  onContinue,
  currentLocale
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const x = useMotionValue(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Transform for the swipe button
  const buttonX = useTransform(x, [0, 200], [0, 200]);
  const backgroundWidth = useTransform(x, [0, 200], [60, 260]);
  const opacity = useTransform(x, [150, 200], [1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Ensure video plays on mobile
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay fails
        console.log('Video autoplay failed');
      });
    }
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 150) {
      setIsComplete(true);
      onContinue();
    } else {
      x.set(0);
    }
  };

  const getSubtitleText = () => {
    if (currentLocale === 'da') {
      return 'Hjælp os med at samle pant og vind fede præmier!';
    } else {
      return 'Help us collect bottles and win awesome prizes!';
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source 
          src={isMobile ? '/videos/UI/background_movie_mobile.mp4' : '/videos/UI/background_movie_desktop.mp4'} 
          type="video/mp4" 
        />
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-between text-white p-6 md:p-8">
        
        {/* Top Logo Section */}
        <div className="flex flex-col items-center pt-12 md:pt-16">
          {/* Main Logo */}
          <div className="mb-8 md:mb-12">
            <img 
              src="/images/UI/Used_bottle_logo_Hvid_2024.png"
              alt="Used Bottle Logo"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>
        </div>

        {/* Center Text Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* PARK Logo */}
          <div className="mb-16 md:mb-20">
            <img 
              src="/images/UI/PARK_logo_white.png"
              alt="PARK Logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 tracking-wide">
            WELCOME TO THE PARK
          </h1>
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            {getSubtitleText()}
          </p>
        </div>

        {/* Bottom Swipe Section */}
        <div className="pb-8 md:pb-12">
          <div className="relative">
            {/* Swipe Track Background */}
            <motion.div 
              className="relative bg-white bg-opacity-20 backdrop-blur-sm rounded-full h-16 md:h-20 flex items-center px-4"
              style={{ width: backgroundWidth }}
              initial={{ width: 240 }}
              animate={{ 
                width: [240, 260, 240],
                boxShadow: [
                  "0 0 0 0 rgba(255, 255, 255, 0.3)",
                  "0 0 0 10px rgba(255, 255, 255, 0.1)",
                  "0 0 0 0 rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Arrow indicators */}
              <motion.div 
                className="absolute right-6 flex items-center gap-1"
                style={{ opacity }}
                animate={{ 
                  x: [0, 5, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <span className="text-white text-xl font-bold">&gt;&gt;</span>
              </motion.div>

              {/* Swipe Button */}
              <motion.div
                className="absolute left-2 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
                style={{ x: buttonX }}
                drag="x"
                dragConstraints={{ left: 0, right: 200 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.1 }}
                whileTap={{ scale: 1.1 }}
                animate={isComplete ? { x: 200, scale: 0.8, opacity: 0 } : {
                  scale: [1, 1.05, 1],
                  y: [0, -2, 0],
                  boxShadow: [
                    "0 4px 8px rgba(0, 0, 0, 0.2)",
                    "0 6px 12px rgba(0, 0, 0, 0.3)",
                    "0 4px 8px rgba(0, 0, 0, 0.2)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-gray-800 font-bold text-sm md:text-base">GO!</span>
              </motion.div>
            </motion.div>

            {/* Instruction text */}
            <motion.p 
              className="text-center text-white text-sm md:text-base mt-4 opacity-80"
              animate={{ 
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {currentLocale === 'da' ? 'Swipe for at fortsætte' : 'Swipe to continue'}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};