-- Create submissions table with proper structure
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project', 'position', 'regulation', 'funding')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  content JSONB NOT NULL DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  auto_saved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Users can create their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = submitted_by);

-- Create storage bucket for submission attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('submission-attachments', 'submission-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own submission attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submission-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own submission attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'submission-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);