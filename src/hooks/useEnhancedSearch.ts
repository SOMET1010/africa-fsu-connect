import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface SearchFilters {
  documentTypes: string[];
  countries: string[];
  sizeRange: { min: number; max: number };
  dateRange: { from: Date | null; to: Date | null };
  downloadRange: { min: number; max: number };
  tags: string[];
  uploadedBy?: string;
  sortBy: 'relevance' | 'date' | 'downloads' | 'size' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  documents: any[];
  totalCount: number;
  facets: {
    documentTypes: { [key: string]: number };
    countries: { [key: string]: number };
    tags: { [key: string]: number };
  };
}

export const useEnhancedSearch = () => {
  const [results, setResults] = useState<SearchResult>({
    documents: [],
    totalCount: 0,
    facets: {
      documentTypes: {},
      countries: {},
      tags: {}
    }
  });
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const performAdvancedSearch = useCallback(async (
    query: string,
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 20
  ) => {
    try {
      setLoading(true);
      
      let supabaseQuery = supabase
        .from('documents')
        .select('*, profiles(display_name)', { count: 'exact' });

      // Full-text search
      if (query.trim()) {
        // Search in title, description, and content
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.documentTypes.length > 0) {
        supabaseQuery = supabaseQuery.in('document_type', filters.documentTypes as any);
      }

      if (filters.countries.length > 0) {
        supabaseQuery = supabaseQuery.in('country', filters.countries);
      }

      if (filters.uploadedBy) {
        supabaseQuery = supabaseQuery.ilike('uploaded_by', `%${filters.uploadedBy}%`);
      }

      // Date range filter
      if (filters.dateRange.from) {
        supabaseQuery = supabaseQuery.gte('created_at', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange.to) {
        supabaseQuery = supabaseQuery.lte('created_at', filters.dateRange.to.toISOString());
      }

      // Size range filter (convert MB to bytes)
      if (filters.sizeRange.min > 0) {
        supabaseQuery = supabaseQuery.gte('file_size', filters.sizeRange.min * 1024 * 1024);
      }
      if (filters.sizeRange.max < 100) {
        supabaseQuery = supabaseQuery.lte('file_size', filters.sizeRange.max * 1024 * 1024);
      }

      // Download range filter
      if (filters.downloadRange.min > 0) {
        supabaseQuery = supabaseQuery.gte('download_count', filters.downloadRange.min);
      }
      if (filters.downloadRange.max < 1000) {
        supabaseQuery = supabaseQuery.lte('download_count', filters.downloadRange.max);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'date':
          supabaseQuery = supabaseQuery.order('created_at', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'downloads':
          supabaseQuery = supabaseQuery.order('download_count', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'size':
          supabaseQuery = supabaseQuery.order('file_size', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'title':
          supabaseQuery = supabaseQuery.order('title', { ascending: filters.sortOrder === 'asc' });
          break;
        default:
          // For relevance, we'll order by a combination of factors
          supabaseQuery = supabaseQuery.order('download_count', { ascending: false });
          break;
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      supabaseQuery = supabaseQuery.range(from, to);

      const { data, error, count } = await supabaseQuery;

      if (error) throw error;

      // Calculate facets (aggregated data for filters)
      const facets = await calculateFacets(query, filters);

      setResults({
        documents: data || [],
        totalCount: count || 0,
        facets
      });

      // Add to search history
      if (query.trim()) {
        setSearchHistory(prev => {
          const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
          return newHistory;
        });
      }

    } catch (error) {
      logger.error('Error performing advanced search:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateFacets = useCallback(async (query: string, filters: SearchFilters) => {
    try {
      // Get aggregated data for document types
      const { data: docTypes } = await supabase
        .from('documents')
        .select('document_type')
        .not('document_type', 'is', null);

      // Get aggregated data for countries
      const { data: countries } = await supabase
        .from('documents')
        .select('country')
        .not('country', 'is', null);

      // Calculate facets
      const documentTypeFacets = docTypes?.reduce((acc, doc) => {
        acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};

      const countryFacets = countries?.reduce((acc, doc) => {
        acc[doc.country] = (acc[doc.country] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};

      return {
        documentTypes: documentTypeFacets,
        countries: countryFacets,
        tags: {} // To be implemented when tags are added to the schema
      };
    } catch (error) {
      logger.error('Error calculating facets:', error);
      return {
        documentTypes: {},
        countries: {},
        tags: {}
      };
    }
  }, []);

  const getSearchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) return [];

    try {
      const { data } = await supabase
        .from('documents')
        .select('title')
        .ilike('title', `%${query}%`)
        .limit(5);

      return data?.map(doc => doc.title) || [];
    } catch (error) {
      logger.error('Error getting suggestions:', error);
      return [];
    }
  }, []);

  const availableFilters = useMemo(() => ({
    documentTypes: Object.keys(results.facets.documentTypes),
    countries: Object.keys(results.facets.countries),
    tags: Object.keys(results.facets.tags)
  }), [results.facets]);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    results,
    loading,
    searchHistory,
    availableFilters,
    performAdvancedSearch,
    getSearchSuggestions,
    clearSearchHistory
  };
};