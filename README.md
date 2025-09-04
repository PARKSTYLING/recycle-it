# Recycle It! - PARK Game

A kiosk/mobile mini-game where players catch PARK product items in a recycling container. Features 20-second rounds, email rewards, and venue-scoped leaderboards.

## Features

- **Canvas-based Game**: Smooth 60fps gameplay with touch/mouse controls
- **Multi-language**: Danish and English support with session persistence
- **Daily Rewards**: One reward per day per user with email delivery
- **Leaderboards**: Venue-scoped monthly rankings
- **Kiosk Mode**: Attract loop after 15 seconds of inactivity
- **GDPR Compliant**: Proper consent handling and data deletion

## Setup

1. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

2. **Supabase Setup**: 
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/create_game_schema.sql`
   - Deploy the Edge Functions in `supabase/functions/`
   - Add your Supabase URL and keys to `.env`

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Game Mechanics

- **Duration**: Exactly 20 seconds per round
- **Scoring**: +20 DKK for PARK products, -20 DKK for trash (floor at 0)
- **Difficulty**: Items fall 20-40% faster by end of round
- **Spawn Rate**: Items spawn every 400-700ms
- **Item Mix**: ~65% recyclable PARK products, 35% noise items

## Business Rules

- **Daily Limit**: Maximum 1 rewarded play per day per email
- **Timezone**: Europe/Copenhagen for daily calculations
- **Rewards**: 10% webshop discount code via email
- **Raffle**: One ticket per valid daily play
- **Monthly Reset**: Data purged on 1st of each month (except users table)

## API Endpoints

- `POST /functions/v1/users-upsert` - Create/update user
- `POST /functions/v1/play-start` - Start new play session
- `POST /functions/v1/play-end` - End session and process rewards
- `GET /functions/v1/leaderboard` - Get venue leaderboard

## Development

The game uses a modular architecture:

- `src/lib/gameEngine.ts` - Core game logic and physics
- `src/lib/supabase.ts` - Database client and API wrapper
- `src/lib/localization.ts` - Multi-language support
- `src/components/` - React UI components for each screen
- `src/hooks/` - Custom React hooks (idle timer, etc.)

## Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting provider.

## Performance Requirements

- **60 FPS** during gameplay
- **<2s TTI** on 4G connections
- **≤2 MB** total asset size (gzipped)
- **Touch targets ≥48px** for accessibility