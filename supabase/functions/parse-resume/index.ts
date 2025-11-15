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
    const { resumeUrl, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the resume file
    console.log('Fetching resume from:', resumeUrl);
    const resumeResponse = await fetch(resumeUrl);
    if (!resumeResponse.ok) {
      throw new Error('Failed to fetch resume file');
    }

    const resumeBuffer = await resumeResponse.arrayBuffer();
    const resumeBase64 = btoa(String.fromCharCode(...new Uint8Array(resumeBuffer)));

    // Use Lovable AI to parse the resume
    const systemPrompt = `You are an expert resume parser. Extract structured information from resumes and return it in JSON format.`;
    
    const userPrompt = `Parse this resume and extract the following information in JSON format:
{
  "full_name": "Full name of the candidate",
  "phone": "Phone number",
  "location": "Location/City",
  "linkedin_url": "LinkedIn profile URL if available",
  "skills": ["array", "of", "skills"],
  "certifications": ["array", "of", "certifications"],
  "experience_years": number (total years of experience),
  "work_experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "duration": "Time period",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "institution": "School/University name",
      "degree": "Degree name",
      "field": "Field of study",
      "year": "Graduation year or time period"
    }
  ]
}

Extract as much information as possible. If a field is not available, use null or empty array.`;

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
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:application/pdf;base64,${resumeBase64}` 
                } 
              }
            ]
          }
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

    console.log('AI Response:', content);
    const parsedData = JSON.parse(content);

    // Update candidate profile with parsed data
    const { error: updateError } = await supabase
      .from('candidate_profiles')
      .upsert({
        user_id: userId,
        full_name: parsedData.full_name,
        phone: parsedData.phone,
        location: parsedData.location,
        linkedin_url: parsedData.linkedin_url,
        skills: parsedData.skills || [],
        certifications: parsedData.certifications || [],
        experience_years: parsedData.experience_years,
        work_experience: parsedData.work_experience || [],
        education: parsedData.education || [],
        parsed_resume_json: parsedData,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ 
      success: true,
      profile: parsedData,
      message: 'Resume parsed and profile updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
