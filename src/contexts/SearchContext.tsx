
import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;

interface SearchState {
  documents: Document[];
  loading: boolean;
  query: string;
  filters: Record<string, string>;
}

type SearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, string> };

const initialState: SearchState = {
  documents: [],
  loading: true,
  query: '',
  filters: {}
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

interface SearchContextType {
  state: SearchState;
  performSearch: (query: string, filters: Record<string, string>) => void;
  fetchInitialDocuments: () => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, { data: Document[]; timestamp: number }>>(new Map());

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
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [toast]);

  const performSearch = useCallback(async (query: string, filters: Record<string, string>) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Create search params key for caching
    const searchKey = JSON.stringify({ query, filters });
    
    // Check cache first
    const cached = cacheRef.current.get(searchKey);
    if (cached && Date.now() - cached.timestamp < 30000) {
      dispatch({ type: 'SET_DOCUMENTS', payload: cached.data });
      return;
    }
    
    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
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
        toast({
          title: "Erreur",
          description: "Erreur lors de la recherche",
          variant: "destructive"
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 300);
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    state,
    performSearch,
    fetchInitialDocuments
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
