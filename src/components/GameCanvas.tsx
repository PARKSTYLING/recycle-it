import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gameAssets } from '../lib/gameAssets';

interface GameItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'recyclable' | 'noise';
  speed: number;
  assetName: string;
}

interface ScoreAnimation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  startTime: number;
}

interface GameCanvasProps {
  onScoreChange: (score: number) => void;
  onTimeChange: (time: number) => void;
  onGameEnd: (finalScore: number, stats: any) => void;
  isPlaying: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onScoreChange,
  onTimeChange,
  onGameEnd,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const gameStartTime = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  
  // Game state
  const [containerX, setContainerX] = useState(0);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<GameItem[]>([]);
  const [scoreAnimations, setScoreAnimations] = useState<ScoreAnimation[]>([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameActive, setGameActive] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Game constants - responsive sizes
  const getGameConstants = () => {
    const isMobile = window.innerWidth < 768;
    return {
      CONTAINER_WIDTH: isMobile ? 120 : 140,
      CONTAINER_HEIGHT: isMobile ? 80 : 100,
      ITEM_SIZE: 100,
      FALL_SPEED: isMobile ? 3.75 : 3,
      SPAWN_INTERVAL: 600,
      GAME_DURATION: 40000,
      CONTAINER_BOTTOM_OFFSET: isMobile ? 20 : 60
    };
  };
  
  // Game stats
  const statsRef = useRef({
    itemsCaught: 0,
    correctCatches: 0,
    wrongCatches: 0
  });

  // Load assets on component mount
  useEffect(() => {
    const loadAssets = async () => {
      await gameAssets.loadAllAssets();
      setAssetsLoaded(true);
      console.log('🎨 All assets loaded for game');
    };
    
    loadAssets();
  }, []);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setCanvasSize({ width: rect.width, height: rect.height });
        
        // Center container initially
        const { CONTAINER_WIDTH } = getGameConstants();
        setContainerX(Math.max(0, rect.width / 2 - CONTAINER_WIDTH / 2));
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Start game when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !gameActive && !gameStartTime.current) {
      // Reset everything
      setScore(0);
      setItems([]);
      setTimeLeft(40);
      setGameActive(true);
      
      // Reset stats
      statsRef.current = {
        itemsCaught: 0,
        correctCatches: 0,
        wrongCatches: 0
      };
      
      // Set start time
      gameStartTime.current = performance.now();
      lastSpawnTime.current = performance.now();
      
      onScoreChange(0);
      onTimeChange(20);
    }
  }, [isPlaying, gameActive, onScoreChange, onTimeChange]);

  // Spawn new item
  const spawnItem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { ITEM_SIZE } = getGameConstants();
    const isRecyclable = Math.random() < 0.65;
    const assetName = isRecyclable 
      ? gameAssets.getRandomRecyclableAsset()
      : gameAssets.getRandomNoiseAsset();
    
    const newItem: GameItem = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (canvas.width - ITEM_SIZE),
      y: -ITEM_SIZE,
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      type: isRecyclable ? 'recyclable' : 'noise',
      speed: getGameConstants().FALL_SPEED,
      assetName
    };
    
    setItems(prev => [...prev, newItem]);
  }, []);

  // Add score animation
  const addScoreAnimation = useCallback((x: number, y: number, points: number, isPositive: boolean) => {
    const animation: ScoreAnimation = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      text: `${isPositive ? '+' : ''}${points} DKK`,
      color: isPositive ? '#22C55E' : '#EF4444',
      opacity: 1,
      startTime: performance.now()
    };
    
    setScoreAnimations(prev => [...prev, animation]);
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    if (!gameActive) return;
    
    const { GAME_DURATION, SPAWN_INTERVAL, CONTAINER_WIDTH, CONTAINER_HEIGHT } = getGameConstants();
    const now = performance.now();
    const elapsed = now - gameStartTime.current;
    const currentTimeLeft = Math.max(0, (GAME_DURATION - elapsed) / 1000);
    
    setTimeLeft(currentTimeLeft);
    onTimeChange(currentTimeLeft);
    
    // Check if game should end
    if (currentTimeLeft <= 0) {
      setGameActive(false);
      onGameEnd(score, statsRef.current);
      return;
    }
    
    // Spawn items
    if (now - lastSpawnTime.current > SPAWN_INTERVAL) {
      spawnItem();
      lastSpawnTime.current = now;
    }
    
    // Update items
    setItems(prevItems => {
      const canvas = canvasRef.current;
      if (!canvas) return prevItems;
      
      return prevItems.filter(item => {
        // Move item down
        item.y += item.speed;
        
        // Check collision with container
        const { CONTAINER_BOTTOM_OFFSET } = getGameConstants();
        const containerY = canvas.height - CONTAINER_HEIGHT - CONTAINER_BOTTOM_OFFSET;
        const itemBottom = item.y + item.height;
        const itemCenterX = item.x + item.width / 2;
        const containerLeft = containerX;
        const containerRight = containerX + CONTAINER_WIDTH;
        
        // Item caught by container
        if (itemBottom >= containerY && 
            itemBottom <= containerY + CONTAINER_HEIGHT &&
            itemCenterX >= containerLeft && 
            itemCenterX <= containerRight) {
          
          statsRef.current.itemsCaught++;
          
          if (item.type === 'recyclable') {
            const newScore = score + 20;
            setScore(newScore);
            onScoreChange(newScore);
            statsRef.current.correctCatches++;
            addScoreAnimation(item.x + item.width / 2, item.y, 20, true);
          } else {
            const newScore = Math.max(0, score - 20);
            setScore(newScore);
            onScoreChange(newScore);
            statsRef.current.wrongCatches++;
            addScoreAnimation(item.x + item.width / 2, item.y, -10, false);
          }
          
          return false; // Remove caught item
        }
        
        // Remove items that fell off screen
        return item.y < canvas.height + 100;
      });
    });
    
    // Update score animations
    setScoreAnimations(prevAnimations => {
      const now = performance.now();
      return prevAnimations.filter(animation => {
        const elapsed = now - animation.startTime;
        const duration = 1500; // 1.5 seconds
        
        if (elapsed >= duration) {
          return false; // Remove expired animation
        }
        
        // Update animation properties
        const progress = elapsed / duration;
        animation.y -= 2; // Float upward
        animation.opacity = 1 - progress; // Fade out
        
        return true;
      });
    });
    
    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, score, containerX, spawnItem, addScoreAnimation, onScoreChange, onTimeChange, onGameEnd]);

  // Start/stop game loop
  useEffect(() => {
    if (gameActive) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameActive, gameLoop]);

  // Container movement handlers
  const getMousePosition = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    
    const rect = canvas.getBoundingClientRect();
    return e.clientX - rect.left;
  }, []);

  const getTouchPosition = useCallback((e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return 0;
    
    const rect = canvas.getBoundingClientRect();
    return e.touches[0].clientX - rect.left;
  }, []);

  const moveContainer = useCallback((x: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { CONTAINER_WIDTH } = getGameConstants();
    const newX = Math.max(0, Math.min(canvas.width - CONTAINER_WIDTH, x - CONTAINER_WIDTH / 2));
    setContainerX(newX);
  }, []);

  // Mouse events
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = getMousePosition(e);
    moveContainer(x);
  }, [getMousePosition, moveContainer]);

  // Touch events
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const x = getTouchPosition(e);
    moveContainer(x);
  }, [getTouchPosition, moveContainer]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { CONTAINER_WIDTH, CONTAINER_HEIGHT, ITEM_SIZE } = getGameConstants();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background image
    const backgroundImage = new Image();
    backgroundImage.src = '/images/UI/game_background.jpg';
    if (backgroundImage.complete) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback gradient while image loads
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#4682B4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw ground - much thicker and more visible
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw container with better visibility
    const { CONTAINER_BOTTOM_OFFSET } = getGameConstants();
    const containerY = canvas.height - CONTAINER_HEIGHT - CONTAINER_BOTTOM_OFFSET;
    
    // Draw falling items with better visibility
    items.forEach(item => {
      const itemImage = gameAssets.getAsset(item.assetName);
      
      if (itemImage) {
        // Draw image
        ctx.drawImage(itemImage, item.x, item.y, item.width, item.height);
      } else {
        // Fallback to colored rectangles if image not loaded
        // Item shadow - more prominent
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(item.x + 3, item.y + 3, item.width, item.height);
        
        // Item body - brighter colors
        ctx.fillStyle = item.type === 'recyclable' ? '#2563EB' : '#DC2626';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        
        // Item border - thicker
        ctx.strokeStyle = item.type === 'recyclable' ? '#1D4ED8' : '#B91C1C';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x, item.y, item.width, item.height);
        
        // Item label - larger font
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.type === 'recyclable' ? 'PARK' : 'TRASH',
          item.x + item.width / 2,
          item.y + item.height / 2 + 4
        );
      }
    });
    
    // Draw score animations
    scoreAnimations.forEach(animation => {
      ctx.save();
      ctx.globalAlpha = animation.opacity;
      ctx.fillStyle = animation.color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      
      // Draw text outline for better visibility
      ctx.strokeText(animation.text, animation.x, animation.y);
      ctx.fillText(animation.text, animation.x, animation.y);
      
      ctx.restore();
    });
    
    // Draw container
    const containerImage = gameAssets.getAsset('container');
    if (containerImage) {
      ctx.drawImage(containerImage, containerX, containerY, CONTAINER_WIDTH, CONTAINER_HEIGHT);
    }
    
  }, [containerX, items, scoreAnimations, canvasSize, assetsLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      style={{ 
        touchAction: 'none',
        display: 'block',
        background: '#87CEEB'
      }}
    />
  );
};