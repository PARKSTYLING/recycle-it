import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { localization } from '../lib/localization';
import { CustomDropdown } from './CustomDropdown';
import { gameAPI } from '../lib/supabase';

interface StartScreenProps {
  onStartGame: (userData?: { userId: string; email: string }) => void;
  onShowLeaderboard: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ 
  onStartGame, 
  onShowLeaderboard
}) => {
  const strings = localization.getStrings();
  const [isMobile, setIsMobile] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(true);
  const [currentLocale, setCurrentLocale] = useState('da');
  const [showTerms, setShowTerms] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLocaleChange = (locale: string) => {
    setCurrentLocale(locale);
    localization.setLocale(locale);
    // Don't set default role when language changes
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStartGame = async () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = strings.nameRequired;
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = strings.emailRequired;
    } else if (!validateEmail(email)) {
      newErrors.email = strings.emailInvalid;
    }
    
    // Validate role
    if (!role) {
      newErrors.role = strings.roleRequired;
    }
    
    // Validate marketing consent
    if (!acceptMarketing) {
      newErrors.marketing = strings.marketingRequired;
    }
    
    setErrors(newErrors);
    
    // If no errors, save user data and start the game
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Map Danish role text to database constraint values
        const getUserTypeForDatabase = (danishRole: string): string => {
          switch (danishRole) {
            case 'Frisørelev eller frisørassistent i Danmark':
              return 'apprentice_dk';
            case 'Frisør/salon fra udlandet':
              return 'salon_abroad';
            case 'Gæst/besøgende':
              return 'guest';
            default:
              return 'guest'; // fallback
          }
        };
        
        // Save user data to Supabase
        const userData = {
          name: name.trim(),
          email: email.trim(),
          user_type: getUserTypeForDatabase(role), // Map to database constraint values
          consent_marketing: acceptMarketing,
          locale: currentLocale
        };
        
        const result = await gameAPI.upsertUser(userData);
        console.log('User saved successfully:', result);
        
        // Start the game after successful save with user data
        onStartGame({
          userId: result.user_id || result.id,
          email: email.trim()
        });
      } catch (error) {
        console.error('Failed to save user data:', error);
        // You could show an error message to the user here
        // For now, we'll still start the game to not block the user experience
        onStartGame();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: `url(/images/UI/${isMobile ? 'primary_background_mobile.jpg' : 'primary_background_desktop.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* PARK Logo at top - always visible */}
      <div className="flex-shrink-0 flex justify-center pt-8 pb-4 relative z-30">
        <img 
          src="/images/UI/PARK_logo_white.png"
          alt="PARK Logo"
          className="h-12 w-auto object-contain"
        />
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 relative z-20 overflow-y-auto" style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain'
      }}>
        <div className="flex items-start justify-center p-4 py-8">
          {/* Main content card */}
          <div className="bg-gray-100 rounded-3xl shadow-2xl p-6 w-full max-w-sm mb-8">
        {/* Main offer */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-green-800 leading-tight">
            {strings.mainOffer}
          </h1>
          <h2 className="text-2xl font-bold text-green-800 leading-tight">
            {strings.mainOfferSubtext}
          </h2>
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-800 text-center mb-4">
          {strings.instructions}
        </p>

        {/* Discount note */}
        <div className="text-center mb-6">
          <p className="text-xs text-gray-800">
            {strings.discountNote.split('15%')[0]}<span className="font-bold">15% {currentLocale === 'da' ? 'rabatkode' : 'discount code'}</span>{strings.discountNote.split('15%')[1]}
          </p>
        </div>

        {/* Language selection flags */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => handleLocaleChange('da')}
            className={`p-1 rounded ${currentLocale === 'da' ? 'ring-2' : ''}`}
            style={{ 
              ringColor: currentLocale === 'da' ? '#77a224' : 'transparent'
            }}
          >
            <img 
              src="/images/flags/da_flag.png" 
              alt="Danish" 
              className="w-9 h-6 object-cover rounded"
            />
          </button>
          <button
            onClick={() => handleLocaleChange('en')}
            className={`p-1 rounded ${currentLocale === 'en' ? 'ring-2' : ''}`}
            style={{ 
              ringColor: currentLocale === 'en' ? '#77a224' : 'transparent'
            }}
          >
            <img 
              src="/images/flags/en_flag.png" 
              alt="English" 
              className="w-9 h-6 object-cover rounded"
            />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4 mb-6">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.enterName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
              className={`w-full px-4 py-3 md:py-2 border rounded-lg focus:ring-2 focus:border-transparent text-base md:text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ 
                '--tw-ring-color': errors.name ? '#ef4444' : '#77a224',
                fontSize: isMobile ? '16px' : '14px' // Prevents zoom on iOS
              } as React.CSSProperties}
              placeholder={strings.enterName}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.enterEmail}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              className={`w-full px-4 py-3 md:py-2 border rounded-lg focus:ring-2 focus:border-transparent text-base md:text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ 
                '--tw-ring-color': errors.email ? '#ef4444' : '#77a224',
                fontSize: isMobile ? '16px' : '14px' // Prevents zoom on iOS
              } as React.CSSProperties}
              placeholder={strings.enterEmail}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.iAm}
            </label>
            <CustomDropdown
              options={[
                { value: 'Frisørelev eller frisørassistent i Danmark', label: strings.hairdressingStudent },
                { value: 'Frisør/salon fra udlandet', label: strings.foreignHairdresser },
                { value: 'Gæst/besøgende', label: strings.guestVisitor }
              ]}
              value={role}
              onChange={(value) => {
                setRole(value);
                clearError('role');
              }}
              placeholder={strings.iAm}
              error={errors.role}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Consent checkbox */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="marketing"
              checked={acceptMarketing}
              onChange={(e) => {
                setAcceptMarketing(e.target.checked);
                clearError('marketing');
              }}
              className="mt-1 w-4 h-4 border-gray-300 rounded"
              style={{ 
                accentColor: '#77a224',
                '--tw-ring-color': '#77a224'
              } as React.CSSProperties}
            />
            <label htmlFor="marketing" className="text-xs text-gray-800 leading-relaxed">
              {strings.acceptMarketing.split('PARK')[0]}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-green-600 underline hover:text-green-700 cursor-pointer"
              >
                PARK
              </button>
              {strings.acceptMarketing.split('PARK')[1]}
            </label>
          </div>
          {errors.marketing && (
            <p className="text-red-500 text-xs mt-1 ml-6">{errors.marketing}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Primary button */}
          <motion.button
            onClick={handleStartGame}
            disabled={isLoading}
            className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-all ${
              isLoading 
                ? 'opacity-75 cursor-not-allowed' 
                : ''
            }`}
            style={{ 
              backgroundColor: isLoading ? '#6a8f1f' : '#77a224',
            }}
            whileHover={!isLoading ? { scale: 1.05, backgroundColor: '#6a8f1f' } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              strings.readySetRecycle
            )}
          </motion.button>

          {/* Secondary button */}
          <motion.button
            onClick={onShowLeaderboard}
            className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all"
            style={{ 
              backgroundColor: '#c6db91',
            }}
            whileHover={{ scale: 1.05, backgroundColor: '#b8d17a' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {strings.scoreboard}
          </motion.button>

          </div>
        </div>
      </div>
    </div>

    {/* Terms and Conditions Popup */}
    <AnimatePresence>
      {showTerms && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTerms(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {strings.termsTitle}
              </h2>
              <button
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                {strings.termsContent}
              </pre>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                {currentLocale === 'da' ? 'Luk' : 'Close'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};