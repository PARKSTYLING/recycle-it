import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }


  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const url = new URL(req.url);
    const venueId = url.searchParams.get('venue_id');

    // Get today's top 10 scores - using Danish timezone (Europe/Copenhagen)
    const now = new Date();
    
    // Convert to Danish timezone
    const danishTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Copenhagen"}));
    const today = new Date(danishTime.getFullYear(), danishTime.getMonth(), danishTime.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    // Convert back to UTC for database query
    const startOfDay = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString();
    const endOfDay = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString();
    

    const query = supabase
      .from('play_sessions')
      .select(`
        final_total_dkk,
        started_at,
        played_on,
        users!inner(name)
      `)
      .gte('played_on', startOfDay)
      .lt('played_on', endOfDay)
      .order('final_total_dkk', { ascending: false })
      .order('started_at', { ascending: true })
      .limit(10);

    if (venueId) {
      query.eq('venue_id', venueId);
    }

    const { data: scores, error } = await query;

    if (error) {
      throw error;
    }

    // Mask names (first name + initial)
    let leaderboard = scores?.map((score, index) => {
      const nameParts = score.users.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
      const maskedName = `${firstName} ${lastInitial}.`.trim();

      return {
        rank: index + 1,
        name_masked: maskedName,
        score_dkk: score.final_total_dkk,
        timestamp: score.started_at
      };
    }) || [];

    // If no real data, return test data for debugging
    if (leaderboard.length === 0) {
      leaderboard = [
        {
          rank: 1,
          name_masked: "Test Player",
          score_dkk: 150,
          timestamp: new Date().toISOString()
        },
        {
          rank: 2,
          name_masked: "Demo User",
          score_dkk: 120,
          timestamp: new Date().toISOString()
        }
      ];
    }

    const response = { 
      leaderboard, 
      message: "Leaderboard API working",
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        leaderboard: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});