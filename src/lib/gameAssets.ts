// Game Assets Manager
// This module handles loading and managing game images

export interface GameAsset {
  name: string;
  src: string;
  type: 'recyclable' | 'noise' | 'ui' | 'background';
  loaded: boolean;
  image?: HTMLImageElement;
}

export class GameAssetsManager {
  private assets: Map<string, GameAsset> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  // Default asset configuration
  private defaultAssets: Omit<GameAsset, 'loaded' | 'image'>[] = [
    // Recyclable items (PARK products) - New 100px product images
    { name: 'product-18-17', src: '/images/items/100px_Produkter_App grafik-18-17.png', type: 'recyclable' },
    { name: 'product-18-18', src: '/images/items/100px_Produkter_App grafik-18-18.png', type: 'recyclable' },
    { name: 'product-18-19', src: '/images/items/100px_Produkter_App grafik-18-19.png', type: 'recyclable' },
    { name: 'product-18-20', src: '/images/items/100px_Produkter_App grafik-18-20.png', type: 'recyclable' },
    { name: 'product-18-21', src: '/images/items/100px_Produkter_App grafik-18-21.png', type: 'recyclable' },
    { name: 'product-18-22', src: '/images/items/100px_Produkter_App grafik-18-22.png', type: 'recyclable' },
    { name: 'product-18-23', src: '/images/items/100px_Produkter_App grafik-18-23.png', type: 'recyclable' },
    { name: 'product-18-24', src: '/images/items/100px_Produkter_App grafik-18-24.png', type: 'recyclable' },
    { name: 'product-18-25', src: '/images/items/100px_Produkter_App grafik-18-25.png', type: 'recyclable' },
    { name: 'product-18-26', src: '/images/items/100px_Produkter_App grafik-18-26.png', type: 'recyclable' },
    
    // Trash items - New 100px trash images
    { name: 'trash-14-13', src: '/images/items/100px_Trash_App grafik-14-13.png', type: 'noise' },
    { name: 'trash-14-14', src: '/images/items/100px_Trash_App grafik-14-14.png', type: 'noise' },
    { name: 'trash-14-15', src: '/images/items/100px_Trash_App grafik-14-15.png', type: 'noise' },
    { name: 'trash-14-16', src: '/images/items/100px_Trash_App grafik-14-16.png', type: 'noise' },
    
    // UI elements
    { name: 'container', src: '/images/UI/container.png', type: 'ui' },
    { name: 'logo', src: '/images/ui/logo.png', type: 'ui' },
    
    // Backgrounds
    { name: 'sky', src: '/images/backgrounds/sky.jpg', type: 'background' },
    { name: 'ground', src: '/images/backgrounds/ground.png', type: 'background' },
  ];

  constructor() {
    this.initializeAssets();
  }

  private initializeAssets() {
    this.defaultAssets.forEach(asset => {
      this.assets.set(asset.name, {
        ...asset,
        loaded: false
      });
    });
  }

  async loadAsset(name: string): Promise<HTMLImageElement | null> {
    const asset = this.assets.get(name);
    if (!asset) {
      console.warn(`Asset '${name}' not found`);
      return null;
    }

    if (asset.loaded && asset.image) {
      return asset.image;
    }

    // Check if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    // Start loading
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        asset.loaded = true;
        asset.image = img;
        this.loadingPromises.delete(name);
        console.log(`✅ Loaded asset: ${name}`);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`❌ Failed to load asset: ${name} from ${asset.src}`);
        this.loadingPromises.delete(name);
        // Don't reject, return null instead to allow fallback rendering
        resolve(null as any);
      };
      
      img.src = asset.src;
    });

    this.loadingPromises.set(name, loadPromise);
    return loadPromise;
  }

  async loadAllAssets(): Promise<void> {
    console.log('🎨 Loading all game assets...');
    const loadPromises = Array.from(this.assets.keys()).map(name => this.loadAsset(name));
    await Promise.allSettled(loadPromises);
    console.log('🎨 Asset loading complete');
  }

  getAsset(name: string): HTMLImageElement | null {
    const asset = this.assets.get(name);
    return asset?.loaded ? asset.image || null : null;
  }

  getRandomRecyclableAsset(): string {
    const recyclableAssets = Array.from(this.assets.values())
      .filter(asset => asset.type === 'recyclable')
      .map(asset => asset.name);
    
    return recyclableAssets[Math.floor(Math.random() * recyclableAssets.length)];
  }

  getRandomNoiseAsset(): string {
    const noiseAssets = Array.from(this.assets.values())
      .filter(asset => asset.type === 'noise')
      .map(asset => asset.name);
    
    return noiseAssets[Math.floor(Math.random() * noiseAssets.length)];
  }

  isAssetLoaded(name: string): boolean {
    return this.assets.get(name)?.loaded || false;
  }

  getLoadedAssetsCount(): number {
    return Array.from(this.assets.values()).filter(asset => asset.loaded).length;
  }

  getTotalAssetsCount(): number {
    return this.assets.size;
  }
}

// Singleton instance
export const gameAssets = new GameAssetsManager();