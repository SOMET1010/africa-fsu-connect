
-- Create table for universal service indicators
CREATE TABLE public.universal_service_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_code TEXT NOT NULL,
  indicator_name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  country_code TEXT,
  region TEXT,
  year INTEGER NOT NULL,
  quarter INTEGER,
  data_source TEXT NOT NULL,
  source_url TEXT,
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create table for data sources
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  api_endpoint TEXT,
  api_key_required BOOLEAN DEFAULT false,
  update_frequency TEXT DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for indicator definitions
CREATE TABLE public.indicator_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT,
  category TEXT,
  data_type TEXT DEFAULT 'numeric',
  calculation_method TEXT,
  source_organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_indicators_country_year ON public.universal_service_indicators(country_code, year);
CREATE INDEX idx_indicators_code_year ON public.universal_service_indicators(indicator_code, year);
CREATE INDEX idx_indicators_region ON public.universal_service_indicators(region);
CREATE INDEX idx_indicators_source ON public.universal_service_indicators(data_source);

-- Enable RLS
ALTER TABLE public.universal_service_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for universal_service_indicators
CREATE POLICY "Anyone can view indicators" 
  ON public.universal_service_indicators 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage indicators" 
  ON public.universal_service_indicators 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- RLS Policies for data_sources
CREATE POLICY "Anyone can view data sources" 
  ON public.data_sources 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage data sources" 
  ON public.data_sources 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- RLS Policies for indicator_definitions
CREATE POLICY "Anyone can view indicator definitions" 
  ON public.indicator_definitions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage indicator definitions" 
  ON public.indicator_definitions 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Insert sample data sources
INSERT INTO public.data_sources (name, acronym, description, website_url, update_frequency) VALUES
('GSM Association', 'GSMA', 'Global trade body for mobile network operators', 'https://www.gsma.com', 'quarterly'),
('International Telecommunication Union', 'ITU', 'UN specialized agency for ICT', 'https://www.itu.int', 'annual'),
('World Bank', 'WB', 'International financial institution', 'https://www.worldbank.org', 'annual'),
('United Nations', 'UN', 'International organization', 'https://www.un.org', 'annual');

-- Insert sample indicator definitions
INSERT INTO public.indicator_definitions (code, name, description, unit, category, source_organization) VALUES
('MOBILE_PENETRATION', 'Mobile Penetration Rate', 'Number of mobile subscriptions per 100 inhabitants', 'percentage', 'connectivity', 'ITU'),
('INTERNET_PENETRATION', 'Internet Penetration Rate', 'Percentage of population using the internet', 'percentage', 'connectivity', 'ITU'),
('BROADBAND_PENETRATION', 'Broadband Penetration Rate', 'Fixed broadband subscriptions per 100 inhabitants', 'percentage', 'connectivity', 'ITU'),
('MOBILE_BROADBAND_PENETRATION', 'Mobile Broadband Penetration', 'Mobile broadband subscriptions per 100 inhabitants', 'percentage', 'connectivity', 'ITU'),
('ICT_DEVELOPMENT_INDEX', 'ICT Development Index', 'Composite index measuring ICT development', 'index', 'development', 'ITU'),
('DIGITAL_DIVIDE_INDEX', 'Digital Divide Index', 'Measures digital inequalities', 'index', 'equality', 'ITU'),
('AFFORDABILITY_INDEX', 'Affordability Index', 'Mobile and fixed broadband affordability', 'index', 'affordability', 'ITU'),
('NETWORK_COVERAGE_4G', '4G Network Coverage', 'Percentage of population covered by 4G networks', 'percentage', 'coverage', 'GSMA'),
('NETWORK_COVERAGE_5G', '5G Network Coverage', 'Percentage of population covered by 5G networks', 'percentage', 'coverage', 'GSMA');
