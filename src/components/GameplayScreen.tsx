import React from 'react';
import { GameCanvas } from './GameCanvas';
import { localization } from '../lib/localization';

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

  return (
    <div className="fixed inset-0 overflow-hidden" style={{
      backgroundImage: 'url(/images/UI/game_background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-80 text-white p-3 md:p-4">
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
      <div className="absolute inset-0 pt-16 md:pt-20" style={{ height: '100vh', width: '100vw' }}>
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