import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { localization } from '../lib/localization';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  finalScore: number;
  userEmail: string;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  finalScore,
  userEmail,
  onPlayAgain,
  onShowLeaderboard
}) => {
  const strings = localization.getStrings();
  const [isMobile, setIsMobile] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

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
    // Score reveal animation
    const animateScore = () => {
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      const updateScore = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        setDisplayScore(Math.floor(finalScore * easedProgress));
        
        if (progress < 1) {
          requestAnimationFrame(updateScore);
        }
      };
      
      requestAnimationFrame(updateScore);
    };
    
    animateScore();
  }, [finalScore]);

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
    <div className="h-screen w-screen flex flex-col relative overflow-hidden" style={{ 
      border: 'none', 
      backgroundColor: '#2D3748',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/UI/secoundary_background_mobile.jpg"
        style={{ 
          objectPosition: 'center top',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#2D3748'
        }}
      >
        <source 
          src={isMobile ? "/videos/UI/background_movie_mobile.mp4" : "/videos/UI/background_movie_desktop.mp4"} 
          type="video/mp4" 
        />
        {/* Fallback image if video fails to load */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/UI/secoundary_background_mobile.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </video>
      
      {/* Scrollable Content Container */}
      <div className="relative z-10 h-full overflow-y-auto" style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain'
      }}>
        <div className="flex flex-col min-h-full px-4">
        {/* PARK Logo at top */}
        <div className="flex justify-center pt-6 pb-6">
          <img 
            src="/images/UI/PARK_logo_white.png"
            alt="PARK Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center space-y-4 py-6" style={{ 
          minHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 120px)',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))'
        }}>
          {/* Main Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-6 mx-auto w-full max-w-sm"
          >
            {/* Header */}
            <h1 className="text-4xl md:text-5xl font-black text-center mb-4 w-full leading-tight" style={{ color: '#48723a' }}>
              {strings.wellPlayed}
            </h1>
            
            {/* Score Section */}
            <div className="text-center mb-4">
              <p className="text-base mb-2" style={{ color: '#48723a' }}>
                {strings.youCollected}
              </p>
              <motion.div 
                className="text-5xl font-bold mb-2" 
                style={{ color: '#48723a' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {displayScore} <span className="font-black">DKK</span>
              </motion.div>
            </div>
            
            {/* Prize Information */}
            <div className="text-center">
              <p className="text-base leading-relaxed" style={{ color: '#48723a' }}>
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
            <h2 className="text-xl font-bold text-center mb-3" style={{ color: '#48723a' }}>
              {strings.wantToSee}
            </h2>
            
            {/* Daily Winner Info */}
            <p className="text-base text-center mb-6" style={{ color: '#48723a' }}>
              {strings.dailyWinner}
            </p>
            
            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={onShowLeaderboard}
                className="w-full py-3 rounded-2xl font-semibold text-white transition-all"
                style={{ backgroundColor: '#c6db91' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {strings.scoreboard}
              </motion.button>
              
              <motion.button
                onClick={onPlayAgain}
                className="w-full py-3 rounded-2xl font-semibold text-white transition-all"
                style={{ backgroundColor: '#77a224' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {strings.playAgain}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Discount Banner - moved here, below the buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-3xl shadow-2xl p-4 mx-auto w-full max-w-sm relative overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 100%)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <h3 className="text-2xl font-bold text-center mb-2" style={{ color: '#48723a' }}>
              {strings.discountBanner}
            </h3>
            <p className="text-base text-center leading-relaxed" style={{ color: '#48723a' }}>
              {strings.discountDetails}
            </p>
          </motion.div>
        </div>
        
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
    </div>
  );
};