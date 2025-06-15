
-- Create the sessions table to store session information
CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  jira_ticket text NULL,
  votes_revealed boolean NOT NULL DEFAULT false
);

-- Create the users table to store user information within a session
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  vote text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security for the tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access since the app doesn't have user authentication yet
CREATE POLICY "Enable all access for anonymous users" ON public.sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anonymous users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Configure tables for real-time updates
ALTER TABLE public.sessions REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- Add tables to the real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
