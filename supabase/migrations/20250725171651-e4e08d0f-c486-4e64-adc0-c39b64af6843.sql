-- Create document_versions table for version control
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  changes_summary TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID NOT NULL
);

-- Create document_comments table for collaborative comments
CREATE TABLE public.document_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on document_versions
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for document_versions
CREATE POLICY "Users can view document versions for public documents" 
ON public.document_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.documents 
    WHERE documents.id = document_versions.document_id 
    AND documents.is_public = true
  )
);

CREATE POLICY "Authenticated users can create document versions" 
ON public.document_versions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on document_comments
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for document_comments
CREATE POLICY "Users can view comments for public documents" 
ON public.document_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.documents 
    WHERE documents.id = document_comments.document_id 
    AND documents.is_public = true
  )
);

CREATE POLICY "Authenticated users can create comments" 
ON public.document_comments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.document_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.document_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_versions_uploaded_at ON public.document_versions(uploaded_at DESC);
CREATE INDEX idx_document_comments_document_id ON public.document_comments(document_id);
CREATE INDEX idx_document_comments_created_at ON public.document_comments(created_at DESC);

-- Add view_count and enhanced metadata to documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;