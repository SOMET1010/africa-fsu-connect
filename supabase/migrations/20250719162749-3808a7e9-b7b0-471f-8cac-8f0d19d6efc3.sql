
-- Create tables for the federated platform based on agency websites
-- Phase 1: Federation Architecture

-- Create agencies table to store partner agency information
CREATE TABLE public.agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('CEDEAO', 'SADC', 'EACO', 'ECCAS', 'UMA')),
  website_url TEXT NOT NULL,
  api_endpoint TEXT,
  logo_url TEXT,
  description TEXT,
  contact_email TEXT,
  phone TEXT,
  address TEXT,
  established_date DATE,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'active', 'error', 'inactive')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency_connectors table to manage different types of connections
CREATE TABLE public.agency_connectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  connector_type TEXT NOT NULL CHECK (connector_type IN ('api', 'scraper', 'rss', 'manual')),
  endpoint_url TEXT,
  auth_method TEXT CHECK (auth_method IN ('none', 'api_key', 'oauth', 'basic')),
  auth_config JSONB DEFAULT '{}',
  sync_frequency INTEGER DEFAULT 3600, -- in seconds
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'inactive' CHECK (sync_status IN ('active', 'error', 'inactive')),
  error_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency_projects table to store projects from federated agencies
CREATE TABLE public.agency_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  external_id TEXT, -- ID from the source agency system
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  budget DECIMAL(15,2),
  beneficiaries INTEGER,
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  tags TEXT[],
  location TEXT,
  coordinates POINT,
  source_url TEXT,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'modified', 'conflict')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency_resources table for federated resources
CREATE TABLE public.agency_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  external_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('document', 'guide', 'report', 'template', 'tool', 'other')),
  file_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  tags TEXT[],
  download_count INTEGER DEFAULT 0,
  source_url TEXT,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'modified', 'conflict')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sync_logs table to track synchronization activities
CREATE TABLE public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  connector_id UUID REFERENCES public.agency_connectors(id) ON DELETE SET NULL,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  duration_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies (public read, admin manage)
CREATE POLICY "Anyone can view agencies" 
ON public.agencies 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage agencies" 
ON public.agencies 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for agency_connectors (admin only)
CREATE POLICY "Admins can manage agency connectors" 
ON public.agency_connectors 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for agency_projects (public read, admin manage)
CREATE POLICY "Anyone can view agency projects" 
ON public.agency_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage agency projects" 
ON public.agency_projects 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for agency_resources (public read, admin manage)
CREATE POLICY "Anyone can view agency resources" 
ON public.agency_resources 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage agency resources" 
ON public.agency_resources 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for sync_logs (admin only)
CREATE POLICY "Admins can view sync logs" 
ON public.sync_logs 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert sync logs" 
ON public.sync_logs 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_agencies_region ON public.agencies(region);
CREATE INDEX idx_agencies_country ON public.agencies(country);
CREATE INDEX idx_agencies_active ON public.agencies(is_active);
CREATE INDEX idx_agency_connectors_agency_id ON public.agency_connectors(agency_id);
CREATE INDEX idx_agency_connectors_type ON public.agency_connectors(connector_type);
CREATE INDEX idx_agency_projects_agency_id ON public.agency_projects(agency_id);
CREATE INDEX idx_agency_projects_status ON public.agency_projects(status);
CREATE INDEX idx_agency_projects_location ON public.agency_projects USING GIST(coordinates);
CREATE INDEX idx_agency_resources_agency_id ON public.agency_resources(agency_id);
CREATE INDEX idx_agency_resources_type ON public.agency_resources(resource_type);
CREATE INDEX idx_sync_logs_agency_id ON public.sync_logs(agency_id);
CREATE INDEX idx_sync_logs_started_at ON public.sync_logs(started_at DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_agencies_updated_at
BEFORE UPDATE ON public.agencies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_connectors_updated_at
BEFORE UPDATE ON public.agency_connectors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_projects_updated_at
BEFORE UPDATE ON public.agency_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_resources_updated_at
BEFORE UPDATE ON public.agency_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample African FSU agencies
INSERT INTO public.agencies (name, acronym, country, region, website_url, description, contact_email) VALUES
('Autorité de Régulation des Communications Électroniques et des Postes', 'ARCEP', 'Côte d''Ivoire', 'CEDEAO', 'https://www.arcep.ci', 'Régulateur des télécommunications de Côte d''Ivoire', 'info@arcep.ci'),
('Communications Authority of Kenya', 'CA', 'Kenya', 'EACO', 'https://ca.go.ke', 'Kenya''s communications regulator', 'info@ca.go.ke'),
('Botswana Communications Regulatory Authority', 'BOCRA', 'Botswana', 'SADC', 'https://www.bocra.org.bw', 'Régulateur des communications du Botswana', 'info@bocra.org.bw'),
('Agence de Régulation des Postes et des Communications Électroniques', 'ARPCE', 'Mali', 'CEDEAO', 'https://www.arpce.gov.ml', 'Régulateur malien des télécommunications', 'contact@arpce.gov.ml'),
('Agence Nationale de Réglementation des Télécommunications', 'ANRT', 'Maroc', 'UMA', 'https://www.anrt.ma', 'Régulateur marocain des télécommunications', 'anrt@anrt.ma');
