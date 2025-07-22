
export interface IndicatorMetadata {
  category?: string;
  source_indicator?: string;
  api_source?: string;
  fetched_at?: string;
  verified?: boolean;
  quality_score?: number;
  last_validated?: string;
  data_freshness?: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface EnhancedIndicator {
  id: string;
  indicator_code: string;
  indicator_name: string;
  value: number;
  unit: string;
  country_code: string;
  region: string;
  year: number;
  quarter?: number;
  data_source: string;
  source_url?: string;
  last_updated_at: string;
  metadata: IndicatorMetadata;
}

export interface IndicatorsByCategory {
  [category: string]: EnhancedIndicator[];
}

export interface RegionalStats {
  region: string;
  totalIndicators: number;
  latestYear: number;
  coverage: number;
}

export interface DataSourceStats {
  name: string;
  totalIndicators: number;
  lastUpdate: string;
  categories: string[];
  apiStatus: 'active' | 'inactive' | 'maintenance';
  reliability: number;
}

export interface IndicatorTrends {
  trends: { [country: string]: Array<{ year: number; value: number }> };
  indicator_name: string;
}
