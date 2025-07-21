
import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;

interface SearchState {
  documents: Document[];
  loading: boolean;
  searching: boolean;
  query: string;
  filters: Record<string, string>;
  lastSearchParams: string;
}

type SearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, string> }
  | { type: 'SET_LAST_SEARCH_PARAMS'; payload: string };

const initialState: SearchState = {
  documents: [],
  loading: true,
  searching: false,
  query: '',
  filters: {},
  lastSearchParams: ''
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCHING':
      return { ...state, searching: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_LAST_SEARCH_PARAMS':
      return { ...state, lastSearchParams: action.payload };
    default:
      return state;
  }
}

interface SearchContextType {
  state: SearchState;
  performSearch: (query: string, filters: Record<string, string>) => void;
  fetchInitialDocuments: () => Promise<void>;
  updateQuery: (query: string) => void;
  updateFilters: (filters: Record<string, string>) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, { data: Document[]; timestamp: number }>>(new Map());

  // Cache cleanup - remove entries older than 5 minutes
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const [key, value] of cacheRef.current.entries()) {
      if (now - value.timestamp > fiveMinutes) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const fetchInitialDocuments = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      dispatch({ type: 'SET_DOCUMENTS', payload: data || [] });
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [toast]);

  const performActualSearch = useCallback(async (query: string, filters: Record<string, string>) => {
    // Create search params key for caching
    const searchKey = JSON.stringify({ query, filters });
    
    // Check cache first
    const cached = cacheRef.current.get(searchKey);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 seconds cache
      dispatch({ type: 'SET_DOCUMENTS', payload: cached.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let queryBuilder = supabase
        .from('documents')
        .select('*')
        .eq('is_public', true);

      // Apply text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.document_type) {
        queryBuilder = queryBuilder.eq('document_type', filters.document_type as any);
      }

      if (filters.country) {
        queryBuilder = queryBuilder.eq('country', filters.country);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      
      const documents = data || [];
      
      // Cache the result
      cacheRef.current.set(searchKey, {
        data: documents,
        timestamp: Date.now()
      });
      
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      console.error('Error searching documents:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_SEARCHING', payload: false });
    }
  }, [toast]);

  const performSearch = useCallback((query: string, filters: Record<string, string>) => {
    const searchParams = JSON.stringify({ query, filters });
    
    // Prevent duplicate searches
    if (searchParams === state.lastSearchParams && !state.loading) {
      return;
    }
    
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    dispatch({ type: 'SET_SEARCHING', payload: true });
    dispatch({ type: 'SET_LAST_SEARCH_PARAMS', payload: searchParams });
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      performActualSearch(query, filters);
    }, 300);
  }, [state.lastSearchParams, state.loading, performActualSearch]);

  const updateQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  const updateFilters = useCallback((filters: Record<string, string>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Periodic cache cleanup
  useEffect(() => {
    const interval = setInterval(cleanupCache, 60000); // Clean every minute
    return () => clearInterval(interval);
  }, [cleanupCache]);

  const value = {
    state,
    performSearch,
    fetchInitialDocuments,
    updateQuery,
    updateFilters
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
