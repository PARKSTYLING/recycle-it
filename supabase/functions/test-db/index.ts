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

    // Test 1: Check if play_sessions table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    console.log('Available tables:', tables);

    // Test 2: Check play_sessions structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'play_sessions')
      .eq('table_schema', 'public');

    console.log('play_sessions columns:', columns);

    // Test 3: Try to get any data from play_sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('play_sessions')
      .select('*')
      .limit(1);

    console.log('play_sessions data:', sessions);
    console.log('play_sessions error:', sessionsError);

    // Test 4: Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    console.log('users data:', users);
    console.log('users error:', usersError);

    return new Response(
      JSON.stringify({ 
        tables: tables?.map(t => t.table_name) || [],
        play_sessions_columns: columns || [],
        play_sessions_data: sessions || [],
        play_sessions_error: sessionsError?.message || null,
        users_data: users || [],
        users_error: usersError?.message || null
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
