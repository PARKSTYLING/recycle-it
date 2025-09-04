import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface StartPlayRequest {
  user_id: string;
  venue_id?: string;
  device_type: 'kiosk' | 'mobile';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { user_id, venue_id, device_type }: StartPlayRequest = await req.json();

    // Daily cap check disabled for development/testing
    // Uncomment below to re-enable daily play limits
    /*
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Copenhagen' });
    
    const { data: existingPlay } = await supabase
      .from('play_sessions')
      .select('id')
      .eq('user_id', user_id)
      .eq('played_on', today)
      .eq('is_valid_daily', true)
      .single();

    if (existingPlay) {
      return new Response(
        JSON.stringify({ 
          error: 'daily_cap',
          message: 'User already played today'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    */

    // Create new play session
    const { data: session, error } = await supabase
      .from('play_sessions')
      .insert({
        user_id,
        venue_id,
        device_type,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    const config = {
      duration_ms: 20000,
      score_per_good: 20,
      penalty_per_bad: 20,
      floor: 0
    };

    return new Response(
      JSON.stringify({ 
        play_session_id: session.id,
        config
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});