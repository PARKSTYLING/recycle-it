import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gameAssets } from '../lib/gameAssets';
import { GAME_CONFIG, getGameConstants } from '../lib/gameConfig';
import { animationManager, EASING } from '../lib/animationUtils';
import { gameItemPool, scoreAnimationPool } from '../lib/objectPool';

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
  const [canvasReady, setCanvasReady] = useState(false);
  const gameLoopRef = useRef<number>();
  
  const gameStartTime = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  
  // Game state
  const [containerX, setContainerX] = useState(0);
  const [score, setScore] = useState(0);
  const [, setTimeLeft] = useState(40);
  const [gameActive, setGameActive] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  
  // Animation states
  const [containerScale, setContainerScale] = useState(1);
  const [containerRotation, setContainerRotation] = useState(0);
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });
  const [flashEffect, setFlashEffect] = useState({ show: false, color: '', duration: 0 });
  
  // Game stats
  const statsRef = useRef({
    itemsCaught: 0,
    correctCatches: 0,
    wrongCatches: 0
  });

  // Load assets on component mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        await gameAssets.loadAllAssets();
        
        // Load background image
        const isMobile = window.innerWidth < 768;
        const backgroundImg = new Image();
        backgroundImg.onload = () => {
          setBackgroundImage(backgroundImg);
        };
        backgroundImg.src = `/images/UI/${isMobile ? 'secoundary_background_mobile.jpg' : 'secoundary_background_desktop.jpg'}`;
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    };
    
    loadAssets();
  }, []);

  // Initialize canvas size - CRITICAL: This must run when canvas is ready
  useEffect(() => {
    if (!canvasReady) {
      return;
    }
    
    // Get canvas from DOM since we can't use canvasRef.current
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      return;
    }
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }
      
      const rect = parent.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        setCanvasSize({ width: rect.width, height: rect.height });
        
        // Center container initially
        const { CONTAINER_WIDTH } = getGameConstants();
        const newContainerX = Math.max(0, rect.width / 2 - CONTAINER_WIDTH / 2);
        setContainerX(newContainerX);
      } else {
        setTimeout(resizeCanvas, 50);
      }
    };
    
    // Try immediately, then with delays if needed
    resizeCanvas();
    const timeoutId1 = setTimeout(resizeCanvas, 50);
    const timeoutId2 = setTimeout(resizeCanvas, 100);
    const timeoutId3 = setTimeout(resizeCanvas, 200);
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasReady, isPlaying]); // Run when canvas is ready or game starts

  // Initialize animation manager
  useEffect(() => {
    animationManager.start();
    return () => animationManager.stop();
  }, []);

  // Start game when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !gameActive && !gameStartTime.current) {
      // Reset everything
      setScore(0);
      setTimeLeft(40);
      setGameActive(true);
      
      // Reset animation states
      setContainerScale(1);
      setContainerRotation(0);
      setScreenShake({ x: 0, y: 0 });
      setFlashEffect({ show: false, color: '', duration: 0 });
      
      // Clear object pools
      gameItemPool.clear();
      scoreAnimationPool.clear();
      animationManager.clear();
      
      // Reset stats
      statsRef.current = {
        itemsCaught: 0,
        correctCatches: 0,
        wrongCatches: 0
      };
      
      // Canvas sizing is now handled by the main useEffect with isPlaying dependency
      
      // Set start time
      gameStartTime.current = performance.now();
      lastSpawnTime.current = performance.now();
      lastFrameTime.current = performance.now();
      
      onScoreChange(0);
      onTimeChange(40);
    }
  }, [isPlaying, gameActive, onScoreChange, onTimeChange]);

  // Spawn new item with animation
  const spawnItem = useCallback(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const { ITEM_SIZE, FALL_SPEED } = getGameConstants();
    const isRecyclable = Math.random() < GAME_CONFIG.RECYCLABLE_CHANCE;
    const assetName = isRecyclable 
      ? gameAssets.getRandomRecyclableAsset()
      : gameAssets.getRandomNoiseAsset();
    
    const newItem = gameItemPool.get();
    newItem.x = Math.random() * (canvas.width - ITEM_SIZE);
    newItem.y = -ITEM_SIZE;
    newItem.width = ITEM_SIZE;
    newItem.height = ITEM_SIZE;
    newItem.type = isRecyclable ? 'recyclable' : 'noise';
    newItem.speed = FALL_SPEED;
    newItem.assetName = assetName;
    newItem.scale = 0; // Start with scale 0 for spawn animation
    newItem.alpha = 0; // Start with alpha 0 for fade-in
    newItem.rotation = 0;
    
    // Animate spawn effect
    animationManager.createAnimation(
      `item-spawn-${newItem.id}`,
      0, 1, GAME_CONFIG.ANIMATIONS.ITEM_SPAWN, EASING.easeOutQuart
    );
  }, []);

  // Add score animation with enhanced effects
  const addScoreAnimation = useCallback((x: number, y: number, points: number, isPositive: boolean) => {
    const animation = scoreAnimationPool.get();
    animation.x = x;
    animation.y = y;
    animation.text = `${isPositive ? '+' : ''}${points} DKK`;
    animation.color = isPositive ? '#22C55E' : '#EF4444';
    animation.opacity = 1;
    animation.startTime = performance.now();
    animation.scale = 0.5; // Start small for pop effect
    animation.velocityY = -2;
    
    // Animate score pop
    animationManager.createAnimation(
      `score-pop-${animation.id}`,
      0.5, 1, GAME_CONFIG.ANIMATIONS.SCORE_POP, EASING.easeOutBack
    );
  }, []);

  // Container bounce animation
  const triggerContainerBounce = useCallback(() => {
    animationManager.createAnimation(
      'container-bounce',
      1, 1.2, GAME_CONFIG.ANIMATIONS.ITEM_CAUGHT_BOUNCE, EASING.easeOutBounce
    );
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback((intensity: number = 10) => {
    animationManager.createScreenShake(intensity, GAME_CONFIG.ANIMATIONS.SCREEN_SHAKE);
  }, []);

  // Flash effect
  const triggerFlash = useCallback((color: string, duration: number = 300) => {
    setFlashEffect({ show: true, color, duration });
    setTimeout(() => {
      setFlashEffect({ show: false, color: '', duration: 0 });
    }, duration);
  }, []);

  // Particle burst effect
  const triggerParticleBurst = useCallback((x: number, y: number, color: string) => {
    animationManager.createParticleBurst(x, y, color, 15);
  }, []);


  // Main game loop with optimizations
  const gameLoop = useCallback(() => {
    if (!gameActive) {
      return;
    }
    
    const now = performance.now();
    lastFrameTime.current = now;
    
    const { GAME_DURATION, SPAWN_INTERVAL, CONTAINER_WIDTH, CONTAINER_HEIGHT, CONTAINER_BOTTOM_OFFSET } = getGameConstants();
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
    
    // Update animations
    animationManager.updateAnimations();
    
    // Update container scale from animation
    const containerBounceScale = animationManager.getAnimationValue('container-bounce') || 1;
    setContainerScale(containerBounceScale);
    
    // Update screen shake
    const shakeOffset = animationManager.getScreenShakeOffset();
    setScreenShake(shakeOffset);
    
    // Update items using object pool
    const activeItems = gameItemPool.getActiveObjects();
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    for (let i = activeItems.length - 1; i >= 0; i--) {
      const item = activeItems[i];
      
      // Update item spawn animation
      const spawnScale = animationManager.getAnimationValue(`item-spawn-${item.id}`) || 1;
      item.scale = spawnScale;
      item.alpha = spawnScale;
      
      // Move item down
      item.y += item.speed;
      
      // Check collision with container
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
          const newScore = score + GAME_CONFIG.SCORE_PER_CORRECT;
          setScore(newScore);
          onScoreChange(newScore);
          statsRef.current.correctCatches++;
          addScoreAnimation(item.x + item.width / 2, item.y, GAME_CONFIG.SCORE_PER_CORRECT, true);
          
          // Trigger positive feedback
          triggerContainerBounce();
          triggerParticleBurst(item.x + item.width / 2, item.y, '#22C55E');
          triggerFlash('#22C55E', 200);
        } else {
          const newScore = Math.max(0, score - GAME_CONFIG.PENALTY_PER_WRONG);
          setScore(newScore);
          onScoreChange(newScore);
          statsRef.current.wrongCatches++;
          addScoreAnimation(item.x + item.width / 2, item.y, -GAME_CONFIG.PENALTY_PER_WRONG, false);
          
          // Trigger negative feedback
          triggerScreenShake(15);
          triggerFlash('#EF4444', 300);
        }
        
        // Return item to pool
        gameItemPool.release(item);
      } else if (item.y > canvas.height + 100) {
        // Remove items that fell off screen
        gameItemPool.release(item);
      }
    }
    
    // Update score animations
    const activeScoreAnimations = scoreAnimationPool.getActiveObjects();
    for (let i = activeScoreAnimations.length - 1; i >= 0; i--) {
      const animation = activeScoreAnimations[i];
      const elapsed = now - animation.startTime;
      const duration = 1500; // 1.5 seconds
      
      if (elapsed >= duration) {
        scoreAnimationPool.release(animation);
        continue;
      }
      
      // Update animation properties
      const progress = elapsed / duration;
      animation.y += animation.velocityY; // Float upward
      animation.opacity = 1 - progress; // Fade out
      
      // Update scale from animation
      const popScale = animationManager.getAnimationValue(`score-pop-${animation.id}`) || 1;
      animation.scale = popScale;
    }
    
    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, score, containerX, spawnItem, addScoreAnimation, triggerContainerBounce, triggerScreenShake, triggerFlash, triggerParticleBurst, onScoreChange, onTimeChange, onGameEnd]);

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
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return 0;
    
    const rect = canvas.getBoundingClientRect();
    return e.clientX - rect.left;
  }, []);

  const getTouchPosition = useCallback((e: React.TouchEvent) => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas || e.touches.length === 0) return 0;
    
    const rect = canvas.getBoundingClientRect();
    return e.touches[0].clientX - rect.left;
  }, []);

  const moveContainer = useCallback((x: number) => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
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
    const x = getTouchPosition(e);
    moveContainer(x);
  }, [getTouchPosition, moveContainer]);

  // Render game
  useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    
    const { CONTAINER_WIDTH, CONTAINER_HEIGHT, CONTAINER_BOTTOM_OFFSET } = getGameConstants();
    const containerY = canvas.height - CONTAINER_HEIGHT - CONTAINER_BOTTOM_OFFSET;
    
    // Enhanced debug logging for mobile container positioning
    if (window.innerWidth < 768 && gameActive) {
      const containerBottom = containerY + CONTAINER_HEIGHT;
      const visibleHeight = Math.min(containerBottom, canvas.height) - Math.max(containerY, 0);
      const visibilityPercentage = (visibleHeight / CONTAINER_HEIGHT) * 100;
      
      const groundY = containerY + CONTAINER_HEIGHT;
      const groundBottom = groundY + 50;
      
      console.log('Mobile Container Debug:', {
        canvasHeight: canvas.height,
        containerHeight: CONTAINER_HEIGHT,
        bottomOffset: CONTAINER_BOTTOM_OFFSET,
        containerY: containerY,
        containerBottom: containerBottom,
        containerX: containerX,
        visibleHeight: visibleHeight,
        visibilityPercentage: Math.round(visibilityPercentage) + '%',
        isFullyVisible: containerY >= 0 && containerBottom <= canvas.height,
        groundY: groundY,
        groundBottom: groundBottom,
        groundVisible: groundY >= 0 && groundBottom <= canvas.height,
        safeAreaBottom: window.innerHeight - window.screen.height
      });
    }
    
    // Apply screen shake offset
    ctx.save();
    ctx.translate(screenShake.x, screenShake.y);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background image - use preloaded image
    if (backgroundImage) {
      // Calculate aspect ratio to maintain image proportions
      const imageAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = canvas.width / canvas.height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imageAspect > canvasAspect) {
        // Image is wider than canvas - fit to height and center horizontally
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller than canvas - fit to width and align to top
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = 0; // Align to top
      }
      
      ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
    } else {
      // Fallback solid color while image loads
      ctx.fillStyle = '#2D3748';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    
    // Draw falling items with animations
    const activeItems = gameItemPool.getActiveObjects();
    activeItems.forEach(item => {
      ctx.save();
      
      // Apply item transformations
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      ctx.translate(centerX, centerY);
      ctx.scale(item.scale, item.scale);
      ctx.globalAlpha = item.alpha;
      ctx.rotate(item.rotation);
      ctx.translate(-centerX, -centerY);
      
      const itemImage = gameAssets.getAsset(item.assetName);
      
      if (itemImage) {
        ctx.drawImage(itemImage, item.x, item.y, item.width, item.height);
      } else {
        // Fallback rendering
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(item.x + 3, item.y + 3, item.width, item.height);
        
        ctx.fillStyle = item.type === 'recyclable' ? '#2563EB' : '#DC2626';
        ctx.fillRect(item.x, item.y, item.width, item.height);
        
        ctx.strokeStyle = item.type === 'recyclable' ? '#1D4ED8' : '#B91C1C';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x, item.y, item.width, item.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.type === 'recyclable' ? 'PARK' : 'TRASH',
          item.x + item.width / 2,
          item.y + item.height / 2 + 4
        );
      }
      
      ctx.restore();
    });
    
    // Draw ground - positioned below the container for proper mobile visibility
    const groundY = containerY + CONTAINER_HEIGHT;
    const groundHeight = 50;
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
    
    // Draw score animations with enhanced effects
    const activeScoreAnimations = scoreAnimationPool.getActiveObjects();
    activeScoreAnimations.forEach(animation => {
      ctx.save();
      ctx.globalAlpha = animation.opacity;
      
      // Apply scale animation
      const centerX = animation.x;
      const centerY = animation.y;
      ctx.translate(centerX, centerY);
      ctx.scale(animation.scale, animation.scale);
      ctx.translate(-centerX, -centerY);
      
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
    
    // Draw particles
    const particles = animationManager.getParticles();
    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // Draw container with animations - ensure it's drawn last for highest z-index
    ctx.save();
    const containerCenterX = containerX + CONTAINER_WIDTH / 2;
    const containerCenterY = containerY + CONTAINER_HEIGHT / 2;
    ctx.translate(containerCenterX, containerCenterY);
    ctx.scale(containerScale, containerScale);
    ctx.rotate(containerRotation);
    ctx.translate(-containerCenterX, -containerCenterY);
    
    // Add a subtle glow effect to make container more visible on mobile
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    const containerImage = gameAssets.getAsset('container');
    if (containerImage) {
      ctx.drawImage(containerImage, containerX, containerY, CONTAINER_WIDTH, CONTAINER_HEIGHT);
    } else {
      // Enhanced fallback container with better visibility
      ctx.fillStyle = '#4A5568';
      ctx.fillRect(containerX, containerY, CONTAINER_WIDTH, CONTAINER_HEIGHT);
      ctx.strokeStyle = '#2D3748';
      ctx.lineWidth = 3;
      ctx.strokeRect(containerX, containerY, CONTAINER_WIDTH, CONTAINER_HEIGHT);
      
      // Add inner highlight for better visibility
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.strokeRect(containerX + 2, containerY + 2, CONTAINER_WIDTH - 4, CONTAINER_HEIGHT - 4);
    }
    ctx.restore();
    
    // Draw flash effect
    if (flashEffect.show) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = flashEffect.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    
    ctx.restore(); // Restore screen shake transform
    
  }, [containerX, containerScale, containerRotation, screenShake, flashEffect, canvasSize, backgroundImage, gameActive, isPlaying]);

  return (
    <canvas
      ref={(canvas) => {
        if (canvas) {
          setCanvasReady(true);
        }
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      style={{ 
        touchAction: 'none',
        display: 'block',
        background: 'transparent',
        position: 'relative',
        zIndex: 1 // Ensure canvas content is properly layered
      }}
    />
  );
};