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
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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

    // Prepare AI prompt
    const systemPrompt = `You are an expert recruiter AI. Analyze the job posting against available candidates and return the top matching candidates with match scores.`;
    
    const userPrompt = `
Job Posting:
${JSON.stringify(jobData, null, 2)}

Available Candidates:
${JSON.stringify(candidates, null, 2)}

Analyze each candidate's skills, experience, and preferences against the job requirements. Return a JSON array of the top 20 matching candidates with the following structure:
{
  "matches": [
    {
      "candidate_id": "user_id",
      "match_score": 95,
      "matching_skills": ["skill1", "skill2"],
      "reason": "Brief explanation of why this is a good match"
    }
  ]
}
`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices[0].message.content;
    
    // Remove markdown code blocks if present
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const analysisResult = JSON.parse(content.trim());

    // Save matches to database
    const matchRecords = analysisResult.matches.map((match: any) => ({
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

    // Insert all matches into database
    const { error: insertError } = await supabase
      .from('ai_match_results')
      .upsert(matchRecords, { onConflict: 'job_id,candidate_id' });

    if (insertError) {
      console.error('Error saving matches:', insertError);
    }

    // Enrich matches with full candidate data
    const enrichedMatches = analysisResult.matches.map((match: any) => {
      const candidate = candidates?.find(c => c.user_id === match.candidate_id);
      return {
        ...match,
        candidate: candidate || null
      };
    }).filter((match: any) => match.candidate !== null);

    return new Response(JSON.stringify({ 
      success: true,
      matches: enrichedMatches 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-job function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
