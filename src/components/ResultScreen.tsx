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
    <div className="h-screen w-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source 
          src={`/videos/UI/${isMobile ? 'background_movie_mobile.mp4' : 'background_movie_desktop.mp4'}`} 
          type="video/mp4" 
        />
        {/* Fallback image if video fails to load */}
        <img 
          src="/images/UI/Kvinde_med_bier.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>
      
      {/* Enhanced dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60 z-10"></div>
      
      {/* Main content container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto max-h-full overflow-y-auto relative z-20 border border-white/20"
      >
        {/* Header with celebration */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg"
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {strings.wellPlayed}
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Fantastisk præstation!</p>
        </motion.div>

        {/* Score Display with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">{strings.youCollected}</h2>
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 150 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 shadow-xl border-4 border-white/50"
            >
              <div className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-lg">
                {finalScore}
              </div>
              <div className="text-xl md:text-2xl text-white/90 font-semibold">DKK</div>
            </motion.div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </motion.div>

        {/* Prize Information with enhanced design */}
        {isFirstPlay && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-200/30 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-800">Tillykke! Du har vundet præmier!</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-green-800 font-medium">
                    {strings.raffleText}
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-green-700">
                    {strings.discountText}
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-green-700">
                    {strings.compareText}
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-3 mt-4">
                  <p className="text-xs md:text-sm text-green-600 font-medium text-center">
                    {strings.dailyWinnerText}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20"
          >
            <RotateCcw size={24} className="md:w-7 md:h-7" />
            {strings.playAgain}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowLeaderboard}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
          >
            <Trophy size={20} className="md:w-6 md:h-6" />
            {strings.leaderboard}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToStart}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 md:py-4 rounded-2xl font-medium text-sm md:text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
          >
            <Mail size={18} className="md:w-5 md:h-5" />
            {strings.backToStart}
          </motion.button>
        </motion.div>

        {/* Debug indicator */}
        {userEmail === 'debug@test.com' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg"
          >
            <p className="text-xs text-red-600 font-medium text-center">
              🐛 DEBUG MODE - This is test data
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};