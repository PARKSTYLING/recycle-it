import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gameAssets } from '../lib/gameAssets';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading assets...');

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoadingText('Loading game assets...');
        
        // Load assets progressively
        const totalAssets = gameAssets.getTotalAssetsCount();
        let loadedCount = 0;
        
        const updateProgress = () => {
          loadedCount = gameAssets.getLoadedAssetsCount();
          const newProgress = Math.min((loadedCount / totalAssets) * 100, 100);
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            setLoadingText('Ready to play!');
            setTimeout(() => {
              onComplete();
            }, 500);
          }
        };
        
        // Start loading all assets
        await gameAssets.loadAllAssets();
        
        // Update progress periodically
        const progressInterval = setInterval(updateProgress, 100);
        
        // Cleanup
        return () => clearInterval(progressInterval);
      } catch (error) {
        console.error('Failed to load assets:', error);
        setLoadingText('Loading failed, continuing anyway...');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };
    
    loadAssets();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-green-600 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
      >
        {/* PARK Logo */}
        <div className="mb-6">
          <img 
            src="/images/UI/PARK_logo_white.png"
            alt="PARK Logo"
            className="h-12 w-auto object-contain mx-auto"
          />
        </div>
        
        {/* Loading Animation */}
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto"
          />
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}%</p>
        </div>
        
        {/* Loading Text */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium text-gray-800"
        >
          {loadingText}
        </motion.p>
        
        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
