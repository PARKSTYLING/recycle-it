import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Trophy, Medal } from 'lucide-react';
import { gameAPI } from '../lib/supabase';
import { localization } from '../lib/localization';

interface LeaderboardEntry {
  rank: number;
  name_masked: string;
  score_dkk: number;
  timestamp: string;
}

interface LeaderboardScreenProps {
  onBack: () => void;
  venueId?: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBack,
  venueId
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const strings = localization.getStrings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Removed testDatabase function since test-db doesn't exist

  const fetchLeaderboard = async () => {
    try {
      const response = await gameAPI.getLeaderboard(venueId);
      
      // If no data, show test data for debugging
      if (!response.leaderboard || response.leaderboard.length === 0) {
        setLeaderboard([
          {
            rank: 1,
            name_masked: "Test Player",
            score_dkk: 150,
            timestamp: new Date().toISOString()
          },
          {
            rank: 2,
            name_masked: "Demo User", 
            score_dkk: 120,
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        setLeaderboard(response.leaderboard);
      }
    } catch (error) {
      // Set test data for debugging if API fails
      setLeaderboard([
        {
          rank: 1,
          name_masked: "Test User",
          score_dkk: 150,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [venueId]);


  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-500" size={24} />;
      case 2: return <Trophy className="text-gray-400" size={24} />;
      case 3: return <Medal className="text-orange-500" size={24} />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3: return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300';
      default: return 'bg-white border-gray-200';
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
        <div className="flex items-start justify-center p-4 py-8" style={{
          paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))'
        }}>
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-shrink-0">
          <button
            onClick={onBack}
            className="p-2 md:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors touch-friendly"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <div className="text-gray-800">
            <h1 className="text-xl md:text-2xl font-bold">Dagens topspillere</h1>
            <p className="text-xs md:text-sm text-gray-600">I dag</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 md:p-6 text-center">
              <div className="animate-spin w-6 h-6 md:w-8 md:h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-600">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-4 md:p-6 text-center text-gray-600">
              <Trophy size={32} className="md:w-10 md:h-10 mx-auto mb-2 md:mb-3 opacity-50" />
              <p className="text-xs md:text-sm">{strings.noPlayersToday}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-y-auto h-full max-h-[460px]">
              {leaderboard.map((entry) => (
                <div
                  key={`${entry.rank}-${entry.timestamp}`}
                  className={`p-3 md:p-4 flex items-center gap-2 md:gap-3 ${getRankBg(entry.rank)} border-l-4`}
                >
                  <div className="flex-shrink-0 w-8 md:w-10 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                      {entry.name_masked}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {new Date(entry.timestamp).toLocaleString('da-DK', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg md:text-xl font-bold text-green-600">
                      {entry.score_dkk}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">DKK</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};