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

    // Prepare AI prompt
    const prompt = `You are an expert recruiter AI. Analyze the following job posting and candidate profiles to find the best matches.

Job Posting:
Title: ${jobData.job_title}
Company: ${jobData.company_name}
Location: ${jobData.location}
Skills Required: ${jobData.skills_required?.join(', ')}
Experience Required: ${jobData.experience_min || 0}-${jobData.experience_max || 10} years
Job Type: ${jobData.job_type}
Description: ${jobData.job_description}

Candidates:
${JSON.stringify(candidates.map(c => ({
  id: c.user.id,
  name: c.full_name || c.user.full_name,
  email: c.user.email,
  location: c.location,
  skills: c.skills || [],
  experience_years: c.experience_years || 0
})), null, 2)}

Return ONLY a JSON object with this exact structure:
{
  "matches": [
    {
      "candidate_id": "uuid",
      "match_score": 85,
      "matching_skills": ["skill1", "skill2"],
      "reason": "Brief explanation of why this candidate is a good match"
    }
  ]
}

Important:
- Only include candidates with match_score >= 60
- Sort by match_score (highest first)
- Return maximum 10 candidates
- Use exact candidate IDs from the input`;

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded. Please try again later.",
          success: false 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Not enough Lovable AI credits. Please add credits in Settings → Workspace → Usage.",
          success: false 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices?.[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from AI');
    }

    // Extract JSON from response (handle markdown code blocks)
    let content = responseText.trim();
    if (content.startsWith('```json')) {
      content = content.slice(7);
    }
    if (content.startsWith('```')) {
      content = content.slice(3);
    }
    if (content.endsWith('```')) {
      content = content.slice(0, -3);
    }
    content = content.trim();
    
    const analysisResult = JSON.parse(content);

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
