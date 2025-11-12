import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function calculateMatchScore(candidateSkills: string[], requiredSkills: string[], candidateExp: number, jobMinExp: number, candidateLocation: string, jobLocation: string): { score: number, skillMatch: any, expMatch: boolean, locMatch: boolean } {
  // Skill matching (60% weight)
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase().trim());
  
  const matchedSkills = normalizedRequiredSkills.filter(skill => 
    normalizedCandidateSkills.some(candSkill => candSkill.includes(skill) || skill.includes(candSkill))
  );
  
  const skillScore = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 60 : 0;
  
  // Experience matching (25% weight)
  const expMatch = candidateExp >= jobMinExp;
  const expScore = expMatch ? 25 : Math.max(0, 25 * (candidateExp / jobMinExp));
  
  // Location matching (15% weight)
  const locMatch = jobLocation.toLowerCase().includes('remote') || 
                   candidateLocation.toLowerCase().includes(jobLocation.toLowerCase()) ||
                   jobLocation.toLowerCase().includes(candidateLocation.toLowerCase());
  const locScore = locMatch ? 15 : 0;
  
  const totalScore = Math.min(100, skillScore + expScore + locScore);
  
  return {
    score: Math.round(totalScore * 100) / 100,
    skillMatch: {
      matched_skills: matchedSkills,
      missing_skills: normalizedRequiredSkills.filter(skill => !matchedSkills.includes(skill)),
      total_required: requiredSkills.length,
      total_matched: matchedSkills.length
    },
    expMatch,
    locMatch
  };
}

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
    const { data: userData } = await supabaseClient
      .from('users')
      .select('id, user_type')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData || userData.user_type !== 'candidate') {
      return new Response(JSON.stringify({ error: 'Only candidates can view job matches' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get candidate profile
    const { data: candidateProfile } = await supabaseClient
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (!candidateProfile) {
      return new Response(JSON.stringify({ error: 'Candidate profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all active jobs
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('job_postings')
      .select('*')
      .eq('status', 'active');

    if (jobsError) {
      console.error('Jobs fetch error:', jobsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch jobs' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate matches
    const matches = jobs.map(job => {
      const matchData = calculateMatchScore(
        candidateProfile.skills || [],
        job.skills_required || [],
        candidateProfile.experience_years || 0,
        job.experience_min || 0,
        candidateProfile.location || '',
        job.location || ''
      );

      return {
        job,
        match_score: matchData.score,
        skill_match_details: matchData.skillMatch,
        experience_match: matchData.expMatch,
        location_match: matchData.locMatch
      };
    });

    // Sort by match score descending
    matches.sort((a, b) => b.match_score - a.match_score);

    // Store top matches in database
    for (const match of matches.slice(0, 20)) {
      await supabaseClient
        .from('ai_match_results')
        .upsert({
          candidate_id: userData.id,
          job_id: match.job.id,
          match_score: match.match_score,
          skill_match_details: match.skill_match_details,
          experience_match: match.experience_match,
          location_match: match.location_match,
          computed_at: new Date().toISOString()
        });
    }

    return new Response(JSON.stringify(matches), {
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