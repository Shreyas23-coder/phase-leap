-- Create enum types
CREATE TYPE user_type AS ENUM ('candidate', 'recruiter');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'remote', 'hybrid');
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'rejected');

-- Users table (extends auth.users with profile data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type user_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate profiles table
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  resume_url TEXT,
  parsed_resume_json JSONB,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  location TEXT,
  job_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recruiter profiles table
CREATE TABLE public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT,
  company_website TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job postings table
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  skills_required TEXT[] NOT NULL DEFAULT '{}',
  experience_min INTEGER DEFAULT 0,
  experience_max INTEGER,
  salary_min INTEGER,
  salary_max INTEGER,
  location TEXT NOT NULL,
  job_type job_type DEFAULT 'full-time',
  is_premium BOOLEAN DEFAULT FALSE,
  status job_status DEFAULT 'active',
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  match_percentage DECIMAL(5,2) CHECK (match_percentage >= 0 AND match_percentage <= 100),
  status application_status DEFAULT 'pending',
  applied_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

-- AI match results table
CREATE TABLE public.ai_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  match_score DECIMAL(5,2) CHECK (match_score >= 0 AND match_score <= 100),
  skill_match_details JSONB,
  experience_match BOOLEAN DEFAULT FALSE,
  location_match BOOLEAN DEFAULT FALSE,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_match_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for candidate_profiles
CREATE POLICY "Candidates can view their own profile"
  ON public.candidate_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = candidate_profiles.user_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Candidates can update their own profile"
  ON public.candidate_profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = candidate_profiles.user_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Candidates can insert their own profile"
  ON public.candidate_profiles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE users.id = candidate_profiles.user_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can view candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.auth_user_id = auth.uid() AND users.user_type = 'recruiter'));

-- RLS Policies for recruiter_profiles
CREATE POLICY "Recruiters can view their own profile"
  ON public.recruiter_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = recruiter_profiles.user_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can update their own profile"
  ON public.recruiter_profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = recruiter_profiles.user_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can insert their own profile"
  ON public.recruiter_profiles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE users.id = recruiter_profiles.user_id AND users.auth_user_id = auth.uid()));

-- RLS Policies for job_postings
CREATE POLICY "Anyone can view active jobs"
  ON public.job_postings FOR SELECT
  USING (status = 'active' OR EXISTS (SELECT 1 FROM public.users WHERE users.id = job_postings.recruiter_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can create jobs"
  ON public.job_postings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE users.id = job_postings.recruiter_id AND users.auth_user_id = auth.uid() AND users.user_type = 'recruiter'));

CREATE POLICY "Recruiters can update their own jobs"
  ON public.job_postings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = job_postings.recruiter_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can delete their own jobs"
  ON public.job_postings FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = job_postings.recruiter_id AND users.auth_user_id = auth.uid()));

-- RLS Policies for applications
CREATE POLICY "Candidates can view their own applications"
  ON public.applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = applications.candidate_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.job_postings jp
    JOIN public.users u ON jp.recruiter_id = u.id
    WHERE jp.id = applications.job_id AND u.auth_user_id = auth.uid()
  ));

CREATE POLICY "Candidates can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE users.id = applications.candidate_id AND users.auth_user_id = auth.uid() AND users.user_type = 'candidate'));

-- RLS Policies for ai_match_results
CREATE POLICY "Candidates can view their own matches"
  ON public.ai_match_results FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = ai_match_results.candidate_id AND users.auth_user_id = auth.uid()));

CREATE POLICY "Recruiters can view matches for their jobs"
  ON public.ai_match_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.job_postings jp
    JOIN public.users u ON jp.recruiter_id = u.id
    WHERE jp.id = ai_match_results.job_id AND u.auth_user_id = auth.uid()
  ));

CREATE POLICY "System can insert match results"
  ON public.ai_match_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update match results"
  ON public.ai_match_results FOR UPDATE
  USING (true);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies for resumes bucket
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own resumes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own resumes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own resumes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Recruiters can view all resumes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    EXISTS (SELECT 1 FROM public.users WHERE users.auth_user_id = auth.uid() AND users.user_type = 'recruiter')
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON public.candidate_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();