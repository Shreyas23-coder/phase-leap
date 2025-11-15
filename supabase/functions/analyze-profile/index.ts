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
    const { profileData, resumeText } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create client with user's auth token
    const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Load fresh profile data from database
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) {
      throw new Error('User not found');
    }

    const { data: profile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (!profile || !profile.skills || profile.skills.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        matches: [],
        message: 'Please complete your profile with skills and experience before analyzing job matches.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch all jobs from database
    const { data: jobs, error: jobsError } = await supabase
      .from('job_postings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      throw jobsError;
    }

    // Prepare AI prompt
    const systemPrompt = `You are an expert job matching AI. Analyze the candidate's profile and resume against available jobs and return the top matching jobs with match scores.`;
    
    const userPrompt = `
Candidate Profile:
${JSON.stringify(profile, null, 2)}

Resume Summary:
${resumeText || profile.parsed_resume_json?.text || 'No resume provided'}

Available Jobs:
${JSON.stringify(jobs, null, 2)}

Analyze the candidate's skills, experience, and preferences against the available jobs. Return ONLY a JSON object with the following structure (no markdown, no code blocks):
{
  "matches": [
    {
      "job_id": "job_id",
      "match_score": 95,
      "matching_skills": ["skill1", "skill2"],
      "reason": "Brief explanation of why this is a good match"
    }
  ]
}

Return the top 10 matching jobs sorted by match_score (highest first). If the candidate has no skills or experience, return an empty matches array.
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
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI Response content:', content);
    
    // Remove markdown code blocks if present
    let cleanContent = content;
    if (cleanContent.includes('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const analysisResult = JSON.parse(cleanContent.trim());

    // Handle both array and object responses
    let matches;
    if (Array.isArray(analysisResult)) {
      // AI returned array directly
      matches = analysisResult;
    } else if (analysisResult.matches && Array.isArray(analysisResult.matches)) {
      // AI returned object with matches property
      matches = analysisResult.matches;
    } else {
      console.error('Invalid AI response structure:', analysisResult);
      throw new Error('AI response does not contain valid matches array');
    }

    // Enrich matches with full job data
    const enrichedMatches = matches.map((match: any) => {
      const job = jobs?.find(j => j.id === match.job_id);
      return {
        ...match,
        job: job || null
      };
    }).filter((match: any) => match.job !== null);

    return new Response(JSON.stringify({ 
      success: true,
      matches: enrichedMatches 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-profile function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
