// Game Configuration Constants
// Centralized configuration for game mechanics, performance, and animations

export const GAME_CONFIG = {
  // Game Mechanics
  GAME_DURATION: 30000, // 30 seconds
  SCORE_PER_CORRECT: 20,
  PENALTY_PER_WRONG: 10,
  SCORE_FLOOR: 0,
  
  // Spawning
  SPAWN_INTERVAL: 600, // milliseconds
  RECYCLABLE_CHANCE: 0.60, // 60% chance for recyclable items
  
  // Physics
  FALL_SPEED_MOBILE: 4,
  FALL_SPEED_DESKTOP: 4,
  
  // Container - Better sizing for visibility and mobile positioning
  CONTAINER_WIDTH_MOBILE: 80,
  CONTAINER_WIDTH_DESKTOP: 100,
  CONTAINER_HEIGHT_MOBILE: 70,
  CONTAINER_HEIGHT_DESKTOP: 85,
  // Significantly increased bottom offset for mobile to ensure full container visibility
  CONTAINER_BOTTOM_OFFSET_MOBILE: 120, // Increased from 60 to 120 for full mobile visibility
  CONTAINER_BOTTOM_OFFSET_DESKTOP: 25,
  
  // Items - Better sizing for visibility
  ITEM_SIZE: 100,
  
  // Performance
  MAX_ITEMS_ON_SCREEN: 20,
  ANIMATION_POOL_SIZE: 50,
  MAX_PARTICLES: 30,
  
  // Animation Durations (in milliseconds)
  ANIMATIONS: {
    ITEM_CAUGHT_BOUNCE: 200,
    SCORE_POP: 150,
    ITEM_SPAWN: 300,
    CONTAINER_MOVE: 100,
    SCREEN_SHAKE: 300,
    PARTICLE_BURST: 400,
    SCORE_REVEAL: 2000,
    BUTTON_HOVER: 150,
    SCREEN_TRANSITION: 500,
    WRONG_CATCH_FLASH: 300,
    CORRECT_CATCH_FLASH: 400,
  },
  
  // Animation Easing
  EASING: {
    EASE_OUT_BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    EASE_OUT_BACK: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    EASE_OUT_QUART: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_OUT_CUBIC: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    EASE_IN_OUT_CUBIC: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    EASE_OUT_ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    EASE_OUT_EXPO: 'cubic-bezier(0.19, 1, 0.22, 1)',
  }
};

// Helper function to get responsive game constants
export const getGameConstants = (canvasWidth?: number, canvasHeight?: number) => {
  const isMobile = window.innerWidth < 768;
  
  return {
    CONTAINER_WIDTH: isMobile ? GAME_CONFIG.CONTAINER_WIDTH_MOBILE : GAME_CONFIG.CONTAINER_WIDTH_DESKTOP,
    CONTAINER_HEIGHT: isMobile ? GAME_CONFIG.CONTAINER_HEIGHT_MOBILE : GAME_CONFIG.CONTAINER_HEIGHT_DESKTOP,
    FALL_SPEED: isMobile ? GAME_CONFIG.FALL_SPEED_MOBILE : GAME_CONFIG.FALL_SPEED_DESKTOP,
    CONTAINER_BOTTOM_OFFSET: isMobile ? GAME_CONFIG.CONTAINER_BOTTOM_OFFSET_MOBILE : GAME_CONFIG.CONTAINER_BOTTOM_OFFSET_DESKTOP,
    ITEM_SIZE: GAME_CONFIG.ITEM_SIZE,
    SPAWN_INTERVAL: GAME_CONFIG.SPAWN_INTERVAL,
    GAME_DURATION: GAME_CONFIG.GAME_DURATION,
  };
};
