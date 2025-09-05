import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { localization } from '../lib/localization';

interface CountdownScreenProps {
  onCountdownEnd: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ onCountdownEnd }) => {
  const strings = localization.getStrings();
  const [isMobile, setIsMobile] = useState(false);
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 150) {
      setIsComplete(true);
      onCountdownEnd();
    } else {
      x.set(0);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(/images/UI/${isMobile ? 'primary_background_mobile.jpg' : 'primary_background_desktop.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full overflow-y-auto" style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain'
      }}>
        <div className="flex flex-col justify-between text-white p-6 md:p-8 min-h-full">
        
        {/* Top Section - PARK Logo */}
        <div className="flex justify-center pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ 
              opacity: 1, 
              y: [0, -5, 0],
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <img 
              src="/images/UI/PARK_logo_white.png"
              alt="PARK Logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-8 md:space-y-10"
          >
            {/* Main Title */}
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold uppercase leading-tight"
              >
                {strings.howToPlayTitle}
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold uppercase leading-tight"
              >
                {strings.howToPlaySubtitle}
              </motion.h1>
            </div>
            
            {/* Game Instructions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="space-y-2"
            >
              <p className="text-lg md:text-xl">
                {strings.gameInstructions}
              </p>
              <p className="text-lg md:text-xl">
                {strings.gameInstructions2}
              </p>
            </motion.div>
            
            {/* Scoring Rules */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="space-y-2"
            >
              <p className="text-lg md:text-xl">
                <span className="font-bold">{strings.scoringRules}</span>
              </p>
              <p className="text-lg md:text-xl">
                <span className="font-bold">{strings.trash}</span>
              </p>
            </motion.div>
            
            
            {/* Ready Question */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="text-center mt-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold">
                {strings.readyQuestion}
              </h2>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Swipe Section */}
        <div className="flex justify-center pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
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
                Swipe for at starte
              </motion.p>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
};