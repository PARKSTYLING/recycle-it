import React from 'react';
import { Clock, RotateCcw, Trophy } from 'lucide-react';
import { localization } from '../lib/localization';

interface DailyCapScreenProps {
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
}

export const DailyCapScreen: React.FC<DailyCapScreenProps> = ({
  onPlayAgain,
  onShowLeaderboard
}) => {
  const strings = localization.getStrings();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto text-center max-h-full overflow-y-auto">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
          <Clock className="text-orange-600" size={32} />
        </div>

        {/* Message */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
          {strings.alreadyPlayed}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          {strings.canPlayTomorrow}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 md:space-y-4">
          <button
            onClick={onPlayAgain}
            className="w-full bg-orange-500 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 hover:bg-orange-600 transition-all transform hover:scale-105 active:scale-95 touch-friendly"
          >
            <RotateCcw size={20} className="md:w-6 md:h-6" />
            {strings.playAgain}
          </button>

          <button
            onClick={onShowLeaderboard}
            className="w-full bg-blue-500 text-white py-2 md:py-3 rounded-xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-blue-600 transition-all touch-friendly"
          >
            <Trophy size={16} className="md:w-5 md:h-5" />
            {strings.leaderboard}
          </button>
        </div>
      </div>
    </div>
  );
};