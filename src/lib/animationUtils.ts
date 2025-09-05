// Animation Utilities
// Helper functions for game animations and effects

export interface AnimationState {
  id: string;
  startTime: number;
  duration: number;
  startValue: number;
  endValue: number;
  currentValue: number;
  easing: (t: number) => number;
  isComplete: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

// Easing functions
export const EASING = {
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
  
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  easeOutQuart: (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  },
  
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },
  
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
};

// Animation manager for smooth animations
export class AnimationManager {
  private animations: Map<string, AnimationState> = new Map();
  private particles: Particle[] = [];
  private animationId: number | null = null;

  // Create a new animation
  createAnimation(
    id: string,
    startValue: number,
    endValue: number,
    duration: number,
    easing: (t: number) => number = EASING.easeOutCubic
  ): void {
    this.animations.set(id, {
      id,
      startTime: performance.now(),
      duration,
      startValue,
      endValue,
      currentValue: startValue,
      easing,
      isComplete: false
    });
  }

  // Update all animations
  updateAnimations(): void {
    const now = performance.now();
    
    this.animations.forEach((animation) => {
      if (animation.isComplete) return;
      
      const elapsed = now - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = animation.easing(progress);
      
      animation.currentValue = animation.startValue + 
        (animation.endValue - animation.startValue) * easedProgress;
      
      if (progress >= 1) {
        animation.isComplete = true;
        animation.currentValue = animation.endValue;
      }
    });
    
    // Remove completed animations
    this.animations.forEach((animation, id) => {
      if (animation.isComplete) {
        this.animations.delete(id);
      }
    });
  }

  // Get current value of an animation
  getAnimationValue(id: string): number | null {
    const animation = this.animations.get(id);
    return animation ? animation.currentValue : null;
  }

  // Check if animation is complete
  isAnimationComplete(id: string): boolean {
    const animation = this.animations.get(id);
    return animation ? animation.isComplete : true;
  }

  // Create particle burst effect
  createParticleBurst(
    x: number,
    y: number,
    color: string,
    count: number = 10
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      
      this.particles.push({
        id: Math.random().toString(36).substring(2, 11),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1
      });
    }
  }

  // Update particles
  updateParticles(): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.life -= 0.02;
      particle.alpha = particle.life;
      
      return particle.life > 0;
    });
  }

  // Get all particles
  getParticles(): Particle[] {
    return this.particles;
  }

  // Screen shake effect
  createScreenShake(intensity: number = 10, duration: number = 300): void {
    this.createAnimation('screenShakeX', 0, intensity, duration, EASING.easeOutElastic);
    this.createAnimation('screenShakeY', 0, intensity, duration, EASING.easeOutElastic);
  }

  // Get screen shake offset
  getScreenShakeOffset(): { x: number; y: number } {
    const x = this.getAnimationValue('screenShakeX') || 0;
    const y = this.getAnimationValue('screenShakeY') || 0;
    
    return {
      x: (Math.random() - 0.5) * x,
      y: (Math.random() - 0.5) * y
    };
  }

  // Start animation loop
  start(): void {
    if (this.animationId) return;
    
    const animate = () => {
      this.updateAnimations();
      this.updateParticles();
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  // Stop animation loop
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Clear all animations and particles
  clear(): void {
    this.animations.clear();
    this.particles = [];
  }
}

// Singleton animation manager
export const animationManager = new AnimationManager();
