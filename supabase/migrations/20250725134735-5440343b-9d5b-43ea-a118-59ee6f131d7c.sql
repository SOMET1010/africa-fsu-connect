-- Create data versioning table
CREATE TABLE public.data_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  data_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  sync_id UUID,
  change_type TEXT NOT NULL DEFAULT 'update'
);

-- Create sync conflicts table
CREATE TABLE public.sync_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  source_data JSONB NOT NULL,
  target_data JSONB NOT NULL,
  conflict_type TEXT NOT NULL,
  resolution_strategy TEXT,
  resolved_data JSONB,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_resolved BOOLEAN NOT NULL DEFAULT false
);

-- Create sync workflows table
CREATE TABLE public.sync_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id),
  workflow_name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  conditions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create sync sessions table for real-time tracking
CREATE TABLE public.sync_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id),
  connector_id UUID NOT NULL REFERENCES public.agency_connectors(id),
  session_type TEXT NOT NULL DEFAULT 'bidirectional',
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  records_processed INTEGER DEFAULT 0,
  conflicts_detected INTEGER DEFAULT 0,
  websocket_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.data_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_versions
CREATE POLICY "Authenticated admins can view all data versions" 
ON public.data_versions 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated system can insert data versions" 
ON public.data_versions 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for sync_conflicts
CREATE POLICY "Authenticated admins can manage sync conflicts" 
ON public.sync_conflicts 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for sync_workflows
CREATE POLICY "Authenticated admins can manage sync workflows" 
ON public.sync_workflows 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for sync_sessions
CREATE POLICY "Authenticated admins can manage sync sessions" 
ON public.sync_sessions 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_data_versions_table_record ON public.data_versions(table_name, record_id);
CREATE INDEX idx_data_versions_created_at ON public.data_versions(created_at);
CREATE INDEX idx_sync_conflicts_agency_unresolved ON public.sync_conflicts(agency_id, is_resolved);
CREATE INDEX idx_sync_workflows_agency_active ON public.sync_workflows(agency_id, is_active);
CREATE INDEX idx_sync_sessions_agency_status ON public.sync_sessions(agency_id, status);

-- Create triggers for updated_at
CREATE TRIGGER update_sync_workflows_updated_at
  BEFORE UPDATE ON public.sync_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();