import React, { useState, useEffect } from 'react';
import { useIdleTimer } from './hooks/useIdleTimer';
import { AttractLoop } from './components/AttractLoop';
import { PreStartScreen } from './components/PreStartScreen';
import { StartScreen } from './components/StartScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { DailyCapScreen } from './components/DailyCapScreen';

type Screen = 'attract' | 'prestart' | 'start' | 'countdown' | 'gameplay' | 'result' | 'leaderboard' | 'dailyCap';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('prestart');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finalScore, setFinalScore] = useState(0);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const resetTimer = useIdleTimer(() => {
    setCurrentScreen('attract');
  }, 30000);

  useEffect(() => {
    resetTimer();
  }, [currentScreen, resetTimer]);

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCurrentScreen('countdown');
    setIsFirstPlay(false);
  };

  const handleGameEnd = () => {
    setFinalScore(score);
    setCurrentScreen('result');
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleTimeChange = (newTime: number) => {
    setTimeLeft(newTime);
    if (newTime <= 0) {
      handleGameEnd();
    }
  };

  const handleDebugResult = () => {
    // Set debug data for result screen
    setFinalScore(150); // High score for testing
    setIsFirstPlay(true); // Show first play benefits
    setUserEmail('debug@test.com'); // Debug email
    setCurrentScreen('result');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'attract':
        return (
          <AttractLoop
            isVisible={true}
            onDismiss={() => setCurrentScreen('prestart')}
          />
        );
      
      case 'prestart':
        return (
          <PreStartScreen
            onContinue={() => setCurrentScreen('start')}
          />
        );
      
      case 'start':
        return (
          <StartScreen
            onStartGame={handleStartGame}
            onShowLeaderboard={() => setCurrentScreen('leaderboard')}
            onDebugResult={handleDebugResult}
          />
        );
      
      case 'countdown':
        return (
          <CountdownScreen
            onCountdownEnd={() => setCurrentScreen('gameplay')}
          />
        );
      
      case 'gameplay':
        return (
          <GameplayScreen
            score={score}
            timeLeft={timeLeft}
            onScoreChange={handleScoreChange}
            onTimeChange={handleTimeChange}
            onGameEnd={handleGameEnd}
          />
        );
      
      case 'result':
        return (
          <ResultScreen
            finalScore={finalScore}
            isFirstPlay={isFirstPlay}
            userEmail={userEmail}
            onPlayAgain={handleStartGame}
            onShowLeaderboard={() => setCurrentScreen('leaderboard')}
            onBackToStart={() => setCurrentScreen('start')}
          />
        );
      
      case 'leaderboard':
        return (
          <LeaderboardScreen
            onBack={() => setCurrentScreen('start')}
          />
        );
      
      case 'dailyCap':
        return (
          <DailyCapScreen
            onPlayAgain={() => setCurrentScreen('start')}
          />
        );
      
      default:
        return (
          <PreStartScreen
            onContinue={() => setCurrentScreen('start')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderScreen()}
    </div>
  );
};

export default App;