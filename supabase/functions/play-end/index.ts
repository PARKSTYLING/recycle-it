import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface EndPlayRequest {
  play_session_id: string;
  final_total_dkk: number;
  items_caught: number;
  correct_catches: number;
  wrong_catches: number;
  duration_ms: number;
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

    const { 
      play_session_id, 
      final_total_dkk, 
      items_caught, 
      correct_catches, 
      wrong_catches, 
      duration_ms 
    }: EndPlayRequest = await req.json();

    // Floor score at 0
    const flooredScore = Math.max(0, final_total_dkk);

    // Update play session
    const { data: session, error: updateError } = await supabase
      .from('play_sessions')
      .update({
        ended_at: new Date().toISOString(),
        duration_ms,
        final_total_dkk: flooredScore,
        items_caught,
        correct_catches,
        wrong_catches
      })
      .eq('id', play_session_id)
      .select('user_id, venue_id, played_on')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Check if this is the user's first valid play today
    const { data: existingValidPlay } = await supabase
      .from('play_sessions')
      .select('id')
      .eq('user_id', session.user_id)
      .eq('played_on', session.played_on)
      .eq('is_valid_daily', true)
      .single();

    let isFirstPlay = false;
    
    if (!existingValidPlay) {
      // Mark as valid daily play
      await supabase
        .from('play_sessions')
        .update({ is_valid_daily: true })
        .eq('id', play_session_id);

      // Create raffle ticket
      await supabase
        .from('raffle_tickets')
        .insert({
          user_id: session.user_id,
          play_session_id,
          venue_id: session.venue_id
        });

      // Send reward email (placeholder - would integrate with email service)
      const { data: user } = await supabase
        .from('users')
        .select('email, name, locale')
        .eq('id', session.user_id)
        .single();

      if (user) {
        await supabase
          .from('reward_emails')
          .insert({
            user_id: session.user_id,
            play_session_id,
            code_sent: Deno.env.get('SHARED_DISCOUNT_CODE') || 'PARK10',
            locale: user.locale
          });
      }

      isFirstPlay = true;
    }

    return new Response(
      JSON.stringify({ 
        final_score: flooredScore,
        is_first_play: isFirstPlay,
        raffle_entered: isFirstPlay
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