import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Mail, Star, Gift, Award } from 'lucide-react';
import { localization } from '../lib/localization';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  finalScore: number;
  isFirstPlay: boolean;
  userEmail: string;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
  onBackToStart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  finalScore,
  isFirstPlay,
  userEmail,
  onPlayAgain,
  onShowLeaderboard,
  onBackToStart
}) => {
  const strings = localization.getStrings();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#22C55E', '#16A34A', '#15803D', '#166534']
      });
    }, 250);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Background Image - Forest */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url(/images/UI/Kvinde_med_bier.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content Container */}
      <div className="flex flex-col h-full relative z-10 px-4 py-6">
        {/* PARK Logo at top */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/UI/PARK_logo_white.png"
            alt="PARK Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Main Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-6 mx-auto w-full max-w-sm"
          >
            {/* Header */}
            <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#48723a' }}>
              {strings.wellPlayed}
            </h1>
            
            {/* Score Section */}
            <div className="text-center mb-4">
              <p className="text-sm mb-2" style={{ color: '#48723a' }}>
                {strings.youCollected}
              </p>
              <div className="text-4xl font-bold mb-2" style={{ color: '#48723a' }}>
                {finalScore} DKK
              </div>
            </div>
            
            {/* Prize Information */}
            <div className="text-center">
              <p className="text-sm leading-relaxed" style={{ color: '#48723a' }}>
                {strings.raffleText}
              </p>
            </div>
          </motion.div>
          
          {/* Secondary Card - Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-6 mx-auto w-full max-w-sm"
          >
            {/* Question */}
            <h2 className="text-lg font-bold text-center mb-3" style={{ color: '#48723a' }}>
              {strings.wantToSee}
            </h2>
            
            {/* Daily Winner Info */}
            <p className="text-sm text-center mb-6" style={{ color: '#48723a' }}>
              {strings.dailyWinner}
            </p>
            
            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={onShowLeaderboard}
                className="w-full py-3 rounded-2xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#c6db91' }}
              >
                {strings.scoreboard}
              </button>
              
              <button
                onClick={onPlayAgain}
                className="w-full py-3 rounded-2xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#77a224' }}
              >
                {strings.playAgain}
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Discount Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-black/70 backdrop-blur-sm rounded-t-3xl p-4 mt-4"
        >
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {strings.discountBanner}
          </h3>
          <p className="text-sm text-white text-center leading-relaxed">
            {strings.discountDetails}
          </p>
        </motion.div>
        
        {/* Debug indicator */}
        {userEmail === 'debug@test.com' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg mx-4"
          >
            <p className="text-xs text-red-600 font-medium text-center">
              🐛 DEBUG MODE - This is test data
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};