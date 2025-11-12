import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { job_id } = await req.json();

    const { data: userData } = await supabaseClient
      .from('users')
      .select('id, user_type')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData || userData.user_type !== 'candidate') {
      return new Response(JSON.stringify({ error: 'Only candidates can apply to jobs' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if already applied
    const { data: existing } = await supabaseClient
      .from('applications')
      .select('id')
      .eq('candidate_id', userData.id)
      .eq('job_id', job_id)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: 'Already applied to this job' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get match score if exists
    const { data: matchData } = await supabaseClient
      .from('ai_match_results')
      .select('match_score')
      .eq('candidate_id', userData.id)
      .eq('job_id', job_id)
      .single();

    const { data, error } = await supabaseClient
      .from('applications')
      .insert({
        candidate_id: userData.id,
        job_id,
        match_percentage: matchData?.match_score || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Application error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit application' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});