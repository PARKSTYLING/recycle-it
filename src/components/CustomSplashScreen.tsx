import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gameAssets } from '../lib/gameAssets';

interface CustomSplashScreenProps {
  onComplete: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    const updateProgress = () => {
      const totalAssets = gameAssets.getTotalAssetsCount();
      const loadedCount = gameAssets.getLoadedAssetsCount();
      const newProgress = Math.min((loadedCount / totalAssets) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setLoadingText('Ready to play!');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };
    
    // Update progress periodically
    const progressInterval = setInterval(updateProgress, 100);
    
    // Cleanup
    return () => clearInterval(progressInterval);
  }, [onComplete]);


  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/UI/background_movie_desktop.mp4" type="video/mp4" />
        <source src="/videos/UI/background_movie_mobile.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* PARK Logo at Top Center */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-16"
        >
          <img 
            src="/images/UI/PARK_logo_white.png"
            alt="PARK Logo"
            className="h-16 w-auto object-contain"
          />
        </motion.div>

        {/* Loading Text and Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-4"
          >
            {loadingText}
          </motion.p>
          
          {/* Progress Bar */}
          <div className="w-64 bg-white bg-opacity-20 rounded-full h-3 mb-2">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress Percentage */}
          <p className="text-lg text-white opacity-80">
            {Math.round(progress)}%
          </p>
        </motion.div>
      </div>
    </div>
  );
};
