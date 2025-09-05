import React from 'react';
import { GameCanvas } from './GameCanvas';
import { localization } from '../lib/localization';
import { LoadingScreen } from './LoadingScreen';

interface GameplayScreenProps {
  score: number;
  timeLeft: number;
  onScoreChange: (score: number) => void;
  onTimeChange: (time: number) => void;
  onGameEnd: (finalScore: number, stats: any) => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  score,
  timeLeft,
  onScoreChange,
  onTimeChange,
  onGameEnd
}) => {
  const strings = localization.getStrings();

  const isMobile = window.innerWidth < 768;
  
  return (
    <div className="fixed inset-0 overflow-hidden" style={{
      backgroundImage: `url(/images/UI/${isMobile ? 'secoundary_background_mobile.jpg' : 'secoundary_background_desktop.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#2D3748',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-80 text-white p-3 md:p-4" style={{
        paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
        paddingLeft: 'calc(0.75rem + env(safe-area-inset-left))',
        paddingRight: 'calc(0.75rem + env(safe-area-inset-right))'
      }}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="text-lg md:text-xl font-bold">
            {strings.score}: {score} DKK
          </div>
          <div className="text-lg md:text-xl font-bold">
            {strings.time}: {Math.ceil(timeLeft)}s
          </div>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="absolute inset-0" style={{ 
        height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem)', 
        width: 'calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right))',
        overflow: 'hidden',
        top: 'calc(env(safe-area-inset-top) + 4rem)',
        left: 'env(safe-area-inset-left)',
        right: 'env(safe-area-inset-right)',
        bottom: 'env(safe-area-inset-bottom)'
      }}>
        <GameCanvas
          onScoreChange={onScoreChange}
          onTimeChange={onTimeChange}
          onGameEnd={onGameEnd}
          isPlaying={true}
        />
      </div>
    </div>
  );
};