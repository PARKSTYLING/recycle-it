import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// API client for Edge Functions
export class GameAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${supabaseUrl}/functions/v1`;
  }

  async upsertUser(userData: {
    name: string;
    email: string;
    user_type: string;
    consent_marketing: boolean;
    locale: string;
  }) {
    const response = await fetch(`${this.baseUrl}/users-upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return response.json();
  }

  async startPlay(playData: {
    user_id: string;
    venue_id?: string;
    device_type: 'kiosk' | 'mobile';
  }) {
    const response = await fetch(`${this.baseUrl}/play-start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(playData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start play');
    }

    return response.json();
  }

  async endPlay(endData: {
    play_session_id: string;
    final_total_dkk: number;
    items_caught: number;
    correct_catches: number;
    wrong_catches: number;
    duration_ms: number;
  }) {
    const response = await fetch(`${this.baseUrl}/play-end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(endData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to end play');
    }

    return response.json();
  }

  async getLeaderboard(venueId?: string) {
    const url = venueId 
      ? `${this.baseUrl}/leaderboard?venue_id=${venueId}`
      : `${this.baseUrl}/leaderboard`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  }

  async testDatabase() {
    const response = await fetch(`${this.baseUrl}/test-db`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to test database');
    }

    return response.json();
  }
}

export const gameAPI = new GameAPI();