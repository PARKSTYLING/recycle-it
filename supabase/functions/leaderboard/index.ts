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

    // Get today's top 10 scores
    // Get today in Danish timezone (Europe/Copenhagen)
    const now = new Date();
    const danishTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Copenhagen"}));
    const startOfDay = new Date(danishTime.getFullYear(), danishTime.getMonth(), danishTime.getDate());
    const endOfDay = new Date(danishTime.getFullYear(), danishTime.getMonth(), danishTime.getDate() + 1);
    
    // Convert back to UTC for database query
    const startOfDayUTC = new Date(startOfDay.getTime() - (startOfDay.getTimezoneOffset() * 60000));
    const endOfDayUTC = new Date(endOfDay.getTime() - (endOfDay.getTimezoneOffset() * 60000));
    
    // First, let's check if play_sessions table exists and has any data
    const { data: allSessions, error: allSessionsError } = await supabase
      .from('play_sessions')
      .select('*')
      .limit(5);
    
    console.log('All play_sessions (first 5):', allSessions);
    console.log('All sessions error:', allSessionsError);

    // If no data, let's try a simpler query without date filtering
    const { data: allSessionsNoFilter, error: allSessionsNoFilterError } = await supabase
      .from('play_sessions')
      .select('*')
      .limit(10);
    
    console.log('All play_sessions (no date filter):', allSessionsNoFilter);
    console.log('All sessions no filter error:', allSessionsNoFilterError);

    const query = supabase
      .from('play_sessions')
      .select(`
        final_total_dkk,
        started_at,
        users!inner(name)
      `)
      .eq('is_valid_daily', true)
      .gte('started_at', startOfDayUTC.toISOString())
      .lt('started_at', endOfDayUTC.toISOString())
      .order('final_total_dkk', { ascending: false })
      .order('started_at', { ascending: true })
      .limit(10);

    if (venueId) {
      query.eq('venue_id', venueId);
    }

    const { data: scores, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    console.log('Raw scores from database:', scores);
    console.log('Date range:', { startOfDayUTC: startOfDayUTC.toISOString(), endOfDayUTC: endOfDayUTC.toISOString() });

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
      console.log('No real data found, returning test data');
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

    // Add debug info to response
    const debugInfo = {
      allSessionsCount: allSessions?.length || 0,
      allSessionsError: allSessionsError?.message || null,
      allSessionsNoFilterCount: allSessionsNoFilter?.length || 0,
      allSessionsNoFilterError: allSessionsNoFilterError?.message || null,
      scoresCount: scores?.length || 0,
      dateRange: {
        startOfDayUTC: startOfDayUTC.toISOString(),
        endOfDayUTC: endOfDayUTC.toISOString()
      },
      timestamp: new Date().toISOString(),
      message: "Debug info from leaderboard Edge Function"
    };

    console.log('Debug info:', debugInfo);

    return new Response(
      JSON.stringify({ 
        leaderboard, 
        debugInfo,
        message: "Leaderboard API working - check debugInfo for database details"
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