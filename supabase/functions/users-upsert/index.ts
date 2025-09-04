import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface UpsertUserRequest {
  name: string;
  email: string;
  user_type: string;
  consent_marketing: boolean;
  locale: string;
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

    const { name, email, user_type, consent_marketing, locale }: UpsertUserRequest = await req.json();

    // Validate input
    if (!name || !email || !user_type || typeof consent_marketing !== 'boolean' || !locale) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert user
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        name,
        email,
        user_type,
        consent_marketing,
        locale,
        policy_version: 'v1'
      }, {
        onConflict: 'email'
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ user_id: user.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});