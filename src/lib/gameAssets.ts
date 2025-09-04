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
    // Recyclable items (PARK products)
    { name: 'argan-conditioner', src: '/images/items/ArganConditioner_800ML_Web.png', type: 'recyclable' },
    { name: 'cypress-shampoo', src: '/images/items/CypressShampoo_800ML_Web.png', type: 'recyclable' },
    { name: 'dry-volume-spray', src: '/images/items/DryVolumeSpray_Web.png', type: 'recyclable' },
    { name: 'firm-hold-spray', src: '/images/items/FirmHoldVolumizingSpray_web-.png', type: 'recyclable' },
    { name: 'hairspray', src: '/images/items/Hairspray_web.png', type: 'recyclable' },
    { name: 'lavender-shampoo', src: '/images/items/LavenderShampoo_800ML_Web.png', type: 'recyclable' },
    { name: 'lavender-violet-conditioner', src: '/images/items/LavenderVioletConditioner_800ML_Web.png', type: 'recyclable' },
    { name: 'moisturizing-heat', src: '/images/items/MoisturizingHeat_Web.png', type: 'recyclable' },
    { name: 'perilla-conditioner', src: '/images/items/PerillaConditioner_800ML_Web.png', type: 'recyclable' },
    { name: 'purified-matte-texture', src: '/images/items/PurifiedMatteTexture_Web.png', type: 'recyclable' },
    { name: 'rose-conditioner', src: '/images/items/RoseConditioner_800ML_Web.png', type: 'recyclable' },
    { name: 'strong-paste', src: '/images/items/StrongPaste2_Web.png', type: 'recyclable' },
    { name: 'texture-spray', src: '/images/items/TextureSpray_web.png', type: 'recyclable' },
    { name: 'ylang-shampoo', src: '/images/items/YlangShampoo_800ML_Web.png', type: 'recyclable' },
    
    // Noise items (trash)
    { name: 'trash-10', src: '/images/items/Ikoner_Webshop_PARK-10.png', type: 'noise' },
    { name: 'trash-11', src: '/images/items/Ikoner_Webshop_PARK-11.png', type: 'noise' },
    { name: 'trash-12', src: '/images/items/Ikoner_Webshop_PARK-12.png', type: 'noise' },
    { name: 'trash-13', src: '/images/items/Ikoner_Webshop_PARK-13.png', type: 'noise' },
    { name: 'trash-14', src: '/images/items/Ikoner_Webshop_PARK-14.png', type: 'noise' },
    { name: 'trash-15', src: '/images/items/Ikoner_Webshop_PARK-15.png', type: 'noise' },
    
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