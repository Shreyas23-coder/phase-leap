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
    const { message, conversationId, action } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user_id from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ user_id: userData.id })
        .select()
        .single();
      
      if (convError) throw convError;
      currentConversationId = newConv.id;
    }

    // Get candidate profile for context
    const { data: profile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    // Define system prompt based on action
    const systemPrompts = {
      'resume-analysis': `You are an expert resume analyst. Analyze resumes and provide detailed feedback on:
- Strengths and areas for improvement
- ATS optimization suggestions
- Keyword recommendations
- Formatting and structure tips
Be specific, actionable, and encouraging.`,
      
      'job-recommendations': `You are a career advisor specializing in job matching. Based on the candidate's profile:
Skills: ${profile?.skills?.join(', ') || 'Not provided'}
Experience: ${profile?.experience_years || 0} years
Location: ${profile?.location || 'Not specified'}

Provide personalized job search strategies, industry insights, and career path recommendations.`,
      
      'interview-prep': `You are an interview coach. Help candidates prepare for interviews by:
- Asking common interview questions
- Providing sample answers
- Offering tips on body language and communication
- Conducting mock interviews
Be encouraging and constructive.`,
      
      'career-advice': `You are a career counselor. Provide guidance on:
- Career transitions and growth
- Skill development
- Work-life balance
- Professional networking
- Salary negotiations
Be empathetic and supportive.`,
      
      'default': `You are an AI Career Assistant helping job seekers with their career journey. You can help with:
- Resume analysis and optimization
- Job recommendations and search strategies
- Interview preparation
- Career advice and planning

Be helpful, professional, and encouraging. Ask clarifying questions when needed.`
    };

    const systemPrompt = systemPrompts[action as keyof typeof systemPrompts] || systemPrompts.default;

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message
      });

    // Build messages array for AI
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: aiMessages,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Save assistant response
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: assistantMessage
      });

    return new Response(JSON.stringify({ 
      success: true,
      message: assistantMessage,
      conversationId: currentConversationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in career-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
