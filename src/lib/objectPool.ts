// Object Pool for Performance Optimization
// Reuses objects to reduce garbage collection pressure

export interface PoolableObject {
  id: string;
  isActive: boolean;
  reset(): void;
}

export class ObjectPool<T extends PoolableObject> {
  private pool: T[] = [];
  private activeObjects: Set<string> = new Set();
  private createFn: () => T;
  private maxSize: number;

  constructor(createFn: () => T, maxSize: number = 100) {
    this.createFn = createFn;
    this.maxSize = maxSize;
  }

  // Get an object from the pool
  get(): T {
    let obj = this.pool.find(item => !item.isActive);
    
    if (!obj) {
      if (this.pool.length < this.maxSize) {
        obj = this.createFn();
        this.pool.push(obj);
      } else {
        // Pool is full, reuse the oldest inactive object
        obj = this.pool.find(item => !item.isActive) || this.pool[0];
        obj.reset();
      }
    }
    
    obj.isActive = true;
    obj.id = Math.random().toString(36).substring(2, 11);
    this.activeObjects.add(obj.id);
    
    return obj;
  }

  // Return an object to the pool
  release(obj: T): void {
    if (!obj.isActive) return;
    
    obj.isActive = false;
    obj.reset();
    this.activeObjects.delete(obj.id);
  }

  // Get all active objects
  getActiveObjects(): T[] {
    return this.pool.filter(obj => obj.isActive);
  }

  // Clear all objects
  clear(): void {
    this.pool.forEach(obj => {
      obj.isActive = false;
      obj.reset();
    });
    this.activeObjects.clear();
  }

  // Get pool statistics
  getStats(): { total: number; active: number; inactive: number } {
    const active = this.activeObjects.size;
    return {
      total: this.pool.length,
      active,
      inactive: this.pool.length - active
    };
  }
}

// Game item interface for pooling
export interface GameItem extends PoolableObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'recyclable' | 'noise';
  speed: number;
  assetName: string;
  scale: number;
  alpha: number;
  rotation: number;
}

// Score animation interface for pooling
export interface ScoreAnimation extends PoolableObject {
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  startTime: number;
  scale: number;
  velocityY: number;
}

// Create object pools
export const gameItemPool = new ObjectPool<GameItem>(() => ({
  id: '',
  isActive: false,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  type: 'recyclable',
  speed: 3,
  assetName: '',
  scale: 1,
  alpha: 1,
  rotation: 0,
  reset() {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.type = 'recyclable';
    this.speed = 3;
    this.assetName = '';
    this.scale = 1;
    this.alpha = 1;
    this.rotation = 0;
  }
}), 50);

export const scoreAnimationPool = new ObjectPool<ScoreAnimation>(() => ({
  id: '',
  isActive: false,
  x: 0,
  y: 0,
  text: '',
  color: '#22C55E',
  opacity: 1,
  startTime: 0,
  scale: 1,
  velocityY: -2,
  reset() {
    this.x = 0;
    this.y = 0;
    this.text = '';
    this.color = '#22C55E';
    this.opacity = 1;
    this.startTime = 0;
    this.scale = 1;
    this.velocityY = -2;
  }
}), 30);
