import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useMemo } from 'react';
import type { Agency } from './useAgencies';

// Query keys optimisés
export const AGENCY_QUERY_KEYS = {
  all: ['agencies'] as const,
  lists: () => [...AGENCY_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...AGENCY_QUERY_KEYS.lists(), filters] as const,
  details: () => [...AGENCY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...AGENCY_QUERY_KEYS.details(), id] as const,
  stats: () => [...AGENCY_QUERY_KEYS.all, 'stats'] as const,
  regions: () => [...AGENCY_QUERY_KEYS.all, 'regions'] as const,
} as const;

interface UseOptimizedAgenciesOptions {
  filters?: {
    region?: string;
    country?: string;
    active?: boolean;
    syncStatus?: string;
  };
  select?: string[];
  prefetchStats?: boolean;
}

export const useOptimizedAgencies = (options: UseOptimizedAgenciesOptions = {}) => {
  const { filters = {}, select, prefetchStats = false } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sélection optimisée des champs
  const selectFields = useMemo(() => {
    if (select) {
      return select.join(', ');
    }
    // Sélection par défaut optimisée
    return `
      id,
      name,
      acronym,
      country,
      region,
      sync_status,
      website_url,
      description,
      is_active,
      last_sync_at,
      created_at,
      updated_at
    `;
  }, [select]);

  // Query principal optimisée avec cache
  const agenciesQuery = useQuery({
    queryKey: AGENCY_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('agencies')
        .select(selectFields.trim())
        .order('name', { ascending: true });

      // Application des filtres de manière optimisée
      if (filters.active !== undefined) {
        query = query.eq('is_active', filters.active);
      } else {
        // Par défaut, seulement les actives
        query = query.eq('is_active', true);
      }

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.syncStatus) {
        query = query.eq('sync_status', filters.syncStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data as unknown as Agency[]) || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - les agences changent peu
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query pour les statistiques des agences (optionnel)
  const statsQuery = useQuery({
    queryKey: AGENCY_QUERY_KEYS.stats(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          region,
          sync_status,
          is_active
        `);

      if (error) throw error;

      // Calcul des stats côté client pour éviter des requêtes complexes
      const stats = (data || []).reduce((acc, agency) => {
        // Par région
        acc.byRegion[agency.region] = (acc.byRegion[agency.region] || 0) + 1;
        
        // Par statut de sync
        acc.bySyncStatus[agency.sync_status] = (acc.bySyncStatus[agency.sync_status] || 0) + 1;
        
        // Total actif/inactif
        if (agency.is_active) {
          acc.active++;
        } else {
          acc.inactive++;
        }
        
        acc.total++;
        return acc;
      }, {
        total: 0,
        active: 0,
        inactive: 0,
        byRegion: {} as Record<string, number>,
        bySyncStatus: {} as Record<string, number>,
      });

      return stats;
    },
    enabled: prefetchStats,
    staleTime: 15 * 60 * 1000, // 15 minutes pour les stats
  });

  // Query pour les régions uniques (pour les filtres)
  const regionsQuery = useQuery({
    queryKey: AGENCY_QUERY_KEYS.regions(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('region')
        .eq('is_active', true);

      if (error) throw error;

      // Extraction des régions uniques
      const uniqueRegions = [...new Set((data || []).map(a => a.region))]
        .filter(Boolean)
        .sort();

      return uniqueRegions;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - les régions changent rarement
  });

  // Mutation pour mettre à jour le statut de sync
  const updateSyncStatusMutation = useMutation({
    mutationFn: async ({ agencyId, status }: { agencyId: string; status: string }) => {
      const { data, error } = await supabase
        .from('agencies')
        .update({ 
          sync_status: status,
          last_sync_at: new Date().toISOString()
        })
        .eq('id', agencyId)
        .select(selectFields.trim())
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedData: any) => {
      // Update optimiste de la cache
      queryClient.setQueryData(AGENCY_QUERY_KEYS.list(filters), (old: Agency[] = []) => {
        return old.map(agency => 
          agency.id === updatedData.id ? { ...agency, ...updatedData } : agency
        );
      });

      // Invalidation des stats si elles sont activées
      if (prefetchStats) {
        queryClient.invalidateQueries({ queryKey: AGENCY_QUERY_KEYS.stats() });
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut de synchronisation a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  // Computed values mémorisés
  const agenciesByRegion = useMemo(() => {
    if (!agenciesQuery.data) return new Map();
    
    return agenciesQuery.data.reduce((acc, agency) => {
      const region = agency.region || 'Non spécifié';
      if (!acc.has(region)) {
        acc.set(region, []);
      }
      acc.get(region)!.push(agency);
      return acc;
    }, new Map<string, Agency[]>());
  }, [agenciesQuery.data]);

  const activeAgencies = useMemo(() => {
    return agenciesQuery.data?.filter(agency => agency.is_active) || [];
  }, [agenciesQuery.data]);

  const syncedAgencies = useMemo(() => {
    return agenciesQuery.data?.filter(agency => agency.sync_status === 'synced') || [];
  }, [agenciesQuery.data]);

  // Prefetch function pour une agence spécifique
  const prefetchAgency = useCallback((agencyId: string) => {
    queryClient.prefetchQuery({
      queryKey: AGENCY_QUERY_KEYS.detail(agencyId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('agencies')
          .select('*')
          .eq('id', agencyId)
          .single();

        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  return {
    // Data
    agencies: agenciesQuery.data || [],
    stats: statsQuery.data,
    regions: regionsQuery.data || [],
    agenciesByRegion,
    activeAgencies,
    syncedAgencies,
    
    // States
    loading: agenciesQuery.isLoading,
    statsLoading: statsQuery.isLoading,
    regionsLoading: regionsQuery.isLoading,
    error: agenciesQuery.error || statsQuery.error || regionsQuery.error,
    
    // Actions
    updateSyncStatus: updateSyncStatusMutation.mutate,
    isUpdatingSyncStatus: updateSyncStatusMutation.isPending,
    
    // Utils
    refetch: () => {
      agenciesQuery.refetch();
      if (prefetchStats) statsQuery.refetch();
    },
    prefetchAgency,
    
    // Cache management
    invalidateAgencies: () => queryClient.invalidateQueries({ queryKey: AGENCY_QUERY_KEYS.all }),
    removeFromCache: (agencyId: string) => queryClient.removeQueries({ queryKey: AGENCY_QUERY_KEYS.detail(agencyId) }),
  };
};