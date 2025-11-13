-- Create candidate_pipeline table to track recruitment stages
CREATE TABLE IF NOT EXISTS public.candidate_pipeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'screening', 'interview', 'offer', 'rejected')),
  status_note TEXT,
  available_date TEXT,
  phone TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

-- Enable RLS
ALTER TABLE public.candidate_pipeline ENABLE ROW LEVEL SECURITY;

-- Recruiters can view pipeline for their jobs
CREATE POLICY "Recruiters can view their pipeline"
ON public.candidate_pipeline
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM job_postings jp
    WHERE jp.id = candidate_pipeline.job_id
    AND jp.recruiter_id = recruiter_id
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = jp.recruiter_id
      AND u.auth_user_id = auth.uid()
    )
  )
);

-- Recruiters can insert pipeline entries
CREATE POLICY "Recruiters can create pipeline entries"
ON public.candidate_pipeline
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM job_postings jp
    WHERE jp.id = candidate_pipeline.job_id
    AND jp.recruiter_id = recruiter_id
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = jp.recruiter_id
      AND u.auth_user_id = auth.uid()
    )
  )
);

-- Recruiters can update their pipeline
CREATE POLICY "Recruiters can update their pipeline"
ON public.candidate_pipeline
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM job_postings jp
    WHERE jp.id = candidate_pipeline.job_id
    AND jp.recruiter_id = recruiter_id
    AND EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = jp.recruiter_id
      AND u.auth_user_id = auth.uid()
    )
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_candidate_pipeline_updated_at
BEFORE UPDATE ON public.candidate_pipeline
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add more fields to candidate_profiles for profile completion
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_candidate_pipeline_job_id ON public.candidate_pipeline(job_id);
CREATE INDEX IF NOT EXISTS idx_candidate_pipeline_candidate_id ON public.candidate_pipeline(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_pipeline_stage ON public.candidate_pipeline(stage);