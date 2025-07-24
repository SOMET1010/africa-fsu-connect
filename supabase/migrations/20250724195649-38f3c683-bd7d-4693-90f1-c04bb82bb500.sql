-- Create translation system tables

-- Languages table
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Translation namespaces for organization
CREATE TABLE public.translation_namespaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main translations table
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  namespace_id UUID NOT NULL REFERENCES public.translation_namespaces(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  context TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(language_id, namespace_id, key)
);

-- Enable RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_namespaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for languages
CREATE POLICY "Anyone can view languages" 
ON public.languages FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage languages" 
ON public.languages FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for namespaces
CREATE POLICY "Anyone can view namespaces" 
ON public.translation_namespaces FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage namespaces" 
ON public.translation_namespaces FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for translations
CREATE POLICY "Anyone can view approved translations" 
ON public.translations FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Admins can view all translations" 
ON public.translations FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage translations" 
ON public.translations FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create translations" 
ON public.translations FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Add indexes for performance
CREATE INDEX idx_translations_language_namespace ON public.translations(language_id, namespace_id);
CREATE INDEX idx_translations_key ON public.translations(key);
CREATE INDEX idx_translations_approved ON public.translations(is_approved);

-- Add triggers for updated_at
CREATE TRIGGER update_languages_updated_at
    BEFORE UPDATE ON public.languages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_namespaces_updated_at
    BEFORE UPDATE ON public.translation_namespaces
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON public.translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default languages
INSERT INTO public.languages (code, name, native_name, is_active, is_default) VALUES
('fr', 'French', 'Français', true, true),
('en', 'English', 'English', true, false);

-- Insert default namespaces
INSERT INTO public.translation_namespaces (name, description) VALUES
('navigation', 'Navigation menu items'),
('dashboard', 'Dashboard interface'),
('forms', 'Form labels and validation'),
('auth', 'Authentication flows'),
('forum', 'Forum interface'),
('resources', 'Resources page'),
('submit', 'Submission forms'),
('profile', 'User profile'),
('admin', 'Administration interface'),
('common', 'Common UI elements'),
('errors', 'Error messages'),
('success', 'Success messages');