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

  const testDatabase = async () => {
    try {
      console.log('Testing database...');
      const response = await gameAPI.testDatabase();
      console.log('Database test response:', response);
    } catch (error) {
      console.error('Database test failed:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard...', { venueId });
      const response = await gameAPI.getLeaderboard(venueId);
      console.log('Leaderboard response:', response);
      console.log('Debug info:', response.debugInfo);
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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

  // Debug: Log when leaderboard changes
  useEffect(() => {
    console.log('Leaderboard updated:', leaderboard);
  }, [leaderboard]);

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
      className="h-screen w-screen flex items-center justify-center p-4 md:p-8 relative"
      style={{
        backgroundImage: `url(/images/UI/${isMobile ? 'primary_background_mobile.jpg' : 'primary_background_desktop.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* PARK Logo at top */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30">
        <img 
          src="/images/UI/PARK_logo_white.png"
          alt="PARK Logo"
          className="h-12 md:h-16 w-auto object-contain"
        />
      </div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto max-h-full overflow-hidden relative z-20 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-shrink-0">
          <button
            onClick={onBack}
            className="p-2 md:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors touch-friendly"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <div className="text-gray-800">
            <h1 className="text-xl md:text-2xl font-bold">{strings.topPlayers}</h1>
            <p className="text-xs md:text-sm text-gray-600">{strings.today}</p>
            {/* Debug button */}
            <button
              onClick={testDatabase}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Test DB
            </button>
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
            <div className="divide-y divide-gray-100 overflow-y-auto h-full max-h-[506px]">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};