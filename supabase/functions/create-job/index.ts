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

    // Get user record
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id, user_type')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (userData.user_type !== 'recruiter') {
      return new Response(JSON.stringify({ error: 'Only recruiters can create jobs' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jobData = await req.json();

    const { data, error } = await supabaseClient
      .from('job_postings')
      .insert({
        recruiter_id: userData.id,
        company_name: jobData.company_name,
        job_title: jobData.job_title,
        job_description: jobData.job_description,
        skills_required: jobData.skills_required || [],
        experience_min: jobData.experience_min || 0,
        experience_max: jobData.experience_max,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        location: jobData.location,
        job_type: jobData.job_type || 'full-time',
        is_premium: jobData.is_premium || false,
        status: jobData.status || 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Create job error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create job' }), {
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