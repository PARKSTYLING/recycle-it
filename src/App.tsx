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
import { gameAPI } from './lib/supabase';

type Screen = 'attract' | 'prestart' | 'start' | 'countdown' | 'gameplay' | 'result' | 'leaderboard' | 'dailyCap';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('prestart');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finalScore, setFinalScore] = useState(0);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [playSessionId, setPlaySessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<any>(null);

  const resetTimer = useIdleTimer(() => {
    setCurrentScreen('attract');
  }, 30000);

  useEffect(() => {
    resetTimer();
  }, [currentScreen, resetTimer]);

  const handleStartGame = async (userData?: { userId: string; email: string }) => {
    setScore(0);
    setTimeLeft(60);
    
    // Store user data if provided
    if (userData) {
      setUserId(userData.userId);
      setUserEmail(userData.email);
    }
    
    // Move to countdown screen immediately for better UX
    setCurrentScreen('countdown');
    setIsFirstPlay(false);
    
    // Start play session in background (non-blocking)
    if (userId || userData?.userId) {
      // Use setTimeout to make it non-blocking
      setTimeout(async () => {
        try {
          const playData = {
            user_id: userId || userData!.userId,
            device_type: 'mobile' as const
          };
          
          const result = await gameAPI.startPlay(playData);
          setPlaySessionId(result.play_session_id);
          console.log('Play session started:', result);
        } catch (error) {
          console.error('Failed to start play session:', error);
          // Continue with game even if session start fails
        }
      }, 0);
    }
  };

  const handleGameEnd = async (finalScore: number, stats: any) => {
    setFinalScore(finalScore);
    setGameStats(stats);
    
    // Save game data to Supabase if we have a play session
    if (playSessionId) {
      try {
        const endData = {
          play_session_id: playSessionId,
          final_total_dkk: finalScore,
          items_caught: stats.itemsCaught || 0,
          correct_catches: stats.correctCatches || 0,
          wrong_catches: stats.wrongCatches || 0,
          duration_ms: 40000 // 40 seconds game duration
        };
        
        const result = await gameAPI.endPlay(endData);
        console.log('Game data saved:', result);
        
        // Update first play status based on API response
        if (result.is_first_play) {
          setIsFirstPlay(true);
        }
      } catch (error) {
        console.error('Failed to save game data:', error);
        // Continue to result screen even if save fails
      }
    }
    
    setCurrentScreen('result');
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleTimeChange = (newTime: number) => {
    setTimeLeft(newTime);
    if (newTime <= 0) {
      // GameCanvas will call onGameEnd with proper parameters
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
            userEmail={userEmail}
            onPlayAgain={handleStartGame}
            onShowLeaderboard={() => setCurrentScreen('leaderboard')}
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
    <div className="h-screen w-screen" style={{ backgroundColor: 'transparent', margin: 0, padding: 0 }}>
      {renderScreen()}
    </div>
  );
};

export default App;