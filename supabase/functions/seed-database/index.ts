import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Stripe", "Airbnb", "Tesla", "SpaceX",
  "Salesforce", "Oracle", "Adobe", "NVIDIA", "Intel", "Uber", "LinkedIn", "Twitter", "Atlassian", "Shopify",
  "Snap", "Reddit", "Coinbase", "OpenAI", "Anthropic", "DeepMind", "Palantir", "Databricks", "Snowflake",
  "MongoDB", "GitLab", "HashiCorp", "Confluent", "Figma", "Notion", "Canva", "Miro", "Asana", "Slack",
  "Zoom", "Datadog", "Elastic", "Splunk", "ServiceNow", "Workday", "HubSpot", "Zendesk", "Twilio", "SendGrid"
];

const jobTitles = [
  "Software Engineer", "Senior Software Engineer", "Staff Software Engineer", "Principal Engineer",
  "Engineering Manager", "Senior Engineering Manager", "Director of Engineering", "VP Engineering",
  "Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "DevOps Engineer",
  "Site Reliability Engineer", "Cloud Engineer", "Data Engineer", "ML Engineer", "Data Scientist",
  "Product Manager", "Senior Product Manager", "Principal Product Manager", "Director of Product",
  "UX Designer", "Product Designer", "UX Researcher", "Design Manager", "Security Engineer",
  "Mobile Engineer", "Platform Engineer", "Solutions Architect", "Technical Architect"
];

const skillSets = [
  ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
  ["Python", "Django", "Flask", "PostgreSQL", "Redis", "Celery", "AWS"],
  ["Java", "Spring Boot", "Microservices", "Kafka", "MySQL", "Docker", "Kubernetes"],
  ["Go", "gRPC", "Distributed Systems", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
  ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest", "Cypress"],
  ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Jupyter"],
  ["AWS", "Terraform", "Kubernetes", "Docker", "Jenkins", "Prometheus", "Grafana"],
  ["Swift", "iOS SDK", "UIKit", "SwiftUI", "Core Data", "XCTest"],
  ["Kotlin", "Android SDK", "Jetpack Compose", "Room", "Retrofit"],
  ["C++", "Rust", "System Design", "Distributed Systems", "Performance Optimization"]
];

const locations = [
  "San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX", "Remote", "Boston, MA",
  "Los Angeles, CA", "Chicago, IL", "Denver, CO", "Portland, OR", "Bangalore, India",
  "London, UK", "Singapore", "Berlin, Germany", "Toronto, Canada", "Sydney, Australia"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting database seeding...');

    // Create 50 recruiter users for job postings
    const recruiterEmails = [];
    for (let i = 0; i < 50; i++) {
      const email = `recruiter${i}@talentai.com`;
      recruiterEmails.push(email);
      
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'Password123!',
        email_confirm: true,
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`Error creating recruiter ${i}:`, authError);
        continue;
      }

      // Update user type
      if (authData?.user) {
        await supabaseAdmin
          .from('users')
          .update({ user_type: 'recruiter' })
          .eq('auth_user_id', authData.user.id);

        // Create recruiter profile
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('auth_user_id', authData.user.id)
          .single();

        if (userData) {
          await supabaseAdmin
            .from('recruiter_profiles')
            .upsert({
              user_id: userData.id,
              company_name: companies[Math.floor(Math.random() * companies.length)],
              location: locations[Math.floor(Math.random() * locations.length)],
            });
        }
      }
    }

    console.log('Recruiters created');

    // Get recruiter IDs
    const { data: recruiters } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('user_type', 'recruiter');

    if (!recruiters || recruiters.length === 0) {
      throw new Error('No recruiters found');
    }

    // Create 500 job postings
    const jobs = [];
    for (let i = 0; i < 500; i++) {
      const recruiter = recruiters[Math.floor(Math.random() * recruiters.length)];
      const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
      const minExp = Math.floor(Math.random() * 10);
      const maxExp = minExp + Math.floor(Math.random() * 8) + 2;
      const salaryMin = 80000 + (minExp * 15000) + Math.floor(Math.random() * 30000);
      const salaryMax = salaryMin + 50000 + Math.floor(Math.random() * 50000);

      jobs.push({
        recruiter_id: recruiter.id,
        company_name: companies[Math.floor(Math.random() * companies.length)],
        job_title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        job_description: `We are seeking a talented professional to join our team. This role involves working on cutting-edge technology and collaborating with world-class engineers.`,
        skills_required: skills.slice(0, 4 + Math.floor(Math.random() * 4)),
        experience_min: minExp,
        experience_max: maxExp,
        salary_min: salaryMin,
        salary_max: salaryMax,
        location: locations[Math.floor(Math.random() * locations.length)],
        job_type: ['full-time', 'remote', 'hybrid'][Math.floor(Math.random() * 3)],
        is_premium: Math.random() > 0.7,
        status: 'active',
      });
    }

    const { error: jobsError } = await supabaseAdmin
      .from('job_postings')
      .upsert(jobs);

    if (jobsError) {
      console.error('Jobs insert error:', jobsError);
      throw jobsError;
    }

    console.log('Jobs created');

    // Create 500 candidate profiles
    for (let i = 0; i < 500; i++) {
      const email = `candidate${i}@example.com`;
      
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'Password123!',
        email_confirm: true,
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`Error creating candidate ${i}:`, authError);
        continue;
      }

      if (authData?.user) {
        await supabaseAdmin
          .from('users')
          .update({ 
            user_type: 'candidate',
            full_name: `Candidate ${i}`
          })
          .eq('auth_user_id', authData.user.id);

        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('auth_user_id', authData.user.id)
          .single();

        if (userData) {
          const candidateSkills = skillSets[Math.floor(Math.random() * skillSets.length)];
          await supabaseAdmin
            .from('candidate_profiles')
            .upsert({
              user_id: userData.id,
              skills: candidateSkills,
              experience_years: Math.floor(Math.random() * 15),
              location: locations[Math.floor(Math.random() * locations.length)],
              job_preferences: {
                role: jobTitles[Math.floor(Math.random() * jobTitles.length)],
                salary_min: 80000 + Math.floor(Math.random() * 100000),
                work_type: ['remote', 'hybrid', 'on-site'][Math.floor(Math.random() * 3)]
              }
            });
        }
      }
    }

    console.log('Candidates created');

    return new Response(JSON.stringify({ 
      message: 'Database seeded successfully',
      jobs: 500,
      candidates: 500,
      recruiters: 50
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});