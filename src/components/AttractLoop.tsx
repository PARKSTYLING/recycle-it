import React from 'react';
import { motion } from 'framer-motion';
import { localization } from '../lib/localization';

// This comment ensures proper React refresh preamble detection

interface AttractLoopProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const AttractLoop: React.FC<AttractLoopProps> = ({ isVisible, onDismiss }) => {
  const strings = localization.getStrings();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-green-600 flex items-center justify-center z-50 cursor-pointer"
      onClick={onDismiss}
      onTouchStart={onDismiss}
    >
      <div className="text-center text-white">
        {/* Animated Product Silhouettes */}
        <div className="mb-8 md:mb-12 relative h-32 md:h-40">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-lg"
              animate={{
                y: [-20, 20, -20],
                x: [0, 10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: '50%'
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">Recycle It!</h1>
          <p className="text-2xl md:text-3xl font-medium mb-6 md:mb-8">{strings.tapToPlay}</p>
          
          {/* Tap Indicator */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 md:w-16 md:h-16 border-4 border-white rounded-full mx-auto flex items-center justify-center"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};