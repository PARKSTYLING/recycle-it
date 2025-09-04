# Game Assets - Image Specifications

This folder contains all image assets for the Recycle It! game.

## Image Size Requirements

### Items (`/items/`)
**Recyclable Items** (PARK products): `bottle.png`, `can.png`, `package.png`, `carton.png`
**Trash Items**: `banana.png`, `cigarette.png`, `wrapper.png`, `tissue.png`

- **Size**: 64x64px (recommended) or 128x128px (high-res)
 **Size**: 64x64px (recommended) - choose ONE size only
- **Format**: PNG with transparency
- **Style**: Clear, colorful icons that are easily distinguishable at small sizes
- **Background**: Transparent
- **File size**: Keep under 50KB each for fast loading

### UI Elements (`/ui/`)

**Container** (`container.png`):
- **Size**: 200x150px 
- **Format**: PNG with transparency
- **Style**: Recycling bin/container that looks inviting
- **Background**: Transparent
- **File size**: Under 100KB

**Logo** (`logo.png`):
- **Size**: 128x128px (square) or 200x100px (rectangular)
- **Format**: PNG with transparency
- **Style**: PARK company logo, clear and readable
- **Background**: Transparent
- **File size**: Under 75KB

### Backgrounds (`/backgrounds/`)

**Sky** (`sky.jpg`):
- **Size**: 1920x1080px (Full HD) or 1280x720px (HD)
- **Format**: JPG (no transparency needed)
- **Style**: Clear blue sky, gradient acceptable
- **File size**: Under 300KB (optimized for web)

**Ground** (`ground.png`):
- **Size**: 1920x200px (wide strip that can repeat)
- **Format**: PNG (if transparency needed) or JPG
- **Style**: Ground/grass texture
- **File size**: Under 150KB

## Mobile Optimization

All images are automatically scaled for mobile devices:
- Items scale from 64px to 40px on mobile
- Container scales from 200x150px to 120x80px on mobile
- Backgrounds are responsive to screen size

## File Naming Convention

Use descriptive, lowercase names with hyphens:
- ✅ `park-bottle.png`, `recycling-container.png`, `blue-sky.jpg`
- ❌ `IMG_001.png`, `Bottle Image.PNG`, `BACKGROUND.JPG`

## Color Guidelines

- **Recyclable items**: Use blue/green tones to indicate "good"
- **Trash items**: Use red/brown tones to indicate "bad"
- **Container**: Bright green (#10B981) works well with the current design
- **High contrast**: Ensure items are visible against sky background

## Testing Your Images

1. Add images to the appropriate folders
2. Refresh the game - images load automatically
3. If an image fails to load, the game shows colored rectangles as fallback
4. Check browser console for any loading errors

## Performance Tips

- Optimize images before uploading (use tools like TinyPNG)
- Keep total asset size under 2MB for fast mobile loading
- Use appropriate formats (PNG for transparency, JPG for photos)
- Test on mobile devices to ensure visibility