-- Allow users to switch between candidate and recruiter types
-- This is needed for users who want to both search for jobs and post jobs

-- Drop the existing policy that only allows users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create a new policy that allows users to update their profile including user_type
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Create a function to safely switch user type
CREATE OR REPLACE FUNCTION public.switch_user_type(new_type user_type)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET user_type = new_type, updated_at = now()
  WHERE auth_user_id = auth.uid();
END;
$$;