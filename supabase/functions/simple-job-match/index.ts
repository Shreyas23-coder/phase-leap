import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobData } = await req.json();

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all candidate profiles from database
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidate_profiles')
      .select(`
        *,
        user:users!candidate_profiles_user_id_fkey(
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      throw candidatesError;
    }

    // Simple matching algorithm
    const matches = candidates
      .map(candidate => {
        const candidateSkills = candidate.skills || [];
        const requiredSkills = jobData.skills_required || [];
        const candidateExp = candidate.experience_years || 0;
        const minExp = jobData.experience_min || 0;
        const maxExp = jobData.experience_max || 100;

        // Calculate skill match
        const matchingSkills = candidateSkills.filter((skill: string) =>
          requiredSkills.some((req: string) => 
            req.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(req.toLowerCase())
          )
        );
        const skillMatchPercent = requiredSkills.length > 0
          ? (matchingSkills.length / requiredSkills.length) * 100
          : 0;

        // Calculate experience match
        const expMatch = candidateExp >= minExp && candidateExp <= maxExp;
        const expScore = expMatch ? 100 : Math.max(0, 100 - Math.abs(candidateExp - minExp) * 10);

        // Calculate location match (basic contains check)
        const locationMatch = candidate.location && jobData.location
          ? candidate.location.toLowerCase().includes(jobData.location.toLowerCase()) ||
            jobData.location.toLowerCase().includes(candidate.location.toLowerCase())
          : false;
        const locationScore = locationMatch ? 100 : 50; // 50% if location doesn't match

        // Overall match score (weighted average)
        const matchScore = Math.round(
          (skillMatchPercent * 0.6) + (expScore * 0.3) + (locationScore * 0.1)
        );

        return {
          candidate_id: candidate.user.id,
          match_score: matchScore,
          matching_skills: matchingSkills,
          reason: `${matchingSkills.length}/${requiredSkills.length} skills match. ${
            expMatch ? 'Experience matches requirements.' : `${candidateExp} years experience.`
          } ${locationMatch ? 'Location matches.' : 'Different location.'}`,
          candidate: candidate
        };
      })
      .filter(match => match.match_score >= 60) // Only include matches >= 60%
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10); // Top 10 matches

    // Save matches to database
    if (matches.length > 0) {
      const matchRecords = matches.map((match: any) => ({
        job_id: jobData.id,
        candidate_id: match.candidate_id,
        match_score: match.match_score,
        skill_match_details: {
          matched: match.matching_skills,
          reason: match.reason
        },
        experience_match: true,
        location_match: true
      }));

      const { error: insertError } = await supabase
        .from('ai_match_results')
        .upsert(matchRecords, { onConflict: 'job_id,candidate_id' });

      if (insertError) {
        console.error('Error saving matches:', insertError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      matches: matches,
      method: 'simple' // Indicate this was non-AI matching
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in simple-job-match function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
