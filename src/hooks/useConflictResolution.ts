import { useState, useEffect, useCallback } from 'react';
import { ConflictResolutionService, type ConflictData, type ConflictResolutionStrategy } from '@/services/conflictResolutionService';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

interface UseConflictResolutionReturn {
  conflicts: ConflictData[];
  isLoading: boolean;
  resolutionStats: {
    total: number;
    resolved: number;
    pending: number;
    autoResolved: number;
  };
  resolveConflict: (conflictId: string, resolvedData: any, strategy: ConflictResolutionStrategy) => Promise<boolean>;
  autoResolveConflicts: (strategy: ConflictResolutionStrategy) => Promise<{ resolved: number; failed: number }>;
  refreshConflicts: () => Promise<void>;
  getConflictHistory: () => Promise<Tables<'sync_conflicts'>[]>;
}

export const useConflictResolution = (agencyId: string): UseConflictResolutionReturn => {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resolutionStats, setResolutionStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    autoResolved: 0
  });
  const { toast } = useToast();

  const refreshConflicts = useCallback(async () => {
    if (!agencyId) return;
    
    try {
      setIsLoading(true);
      const [conflictData, stats] = await Promise.all([
        ConflictResolutionService.getUnresolvedConflicts(agencyId),
        ConflictResolutionService.getResolutionStats(agencyId)
      ]);
      
      setConflicts(conflictData);
      setResolutionStats(stats);
    } catch (error) {
      logger.error('Error refreshing conflicts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conflits de synchronisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [agencyId, toast]);

  const resolveConflict = useCallback(async (
    conflictId: string, 
    resolvedData: any, 
    strategy: ConflictResolutionStrategy
  ): Promise<boolean> => {
    try {
      const success = await ConflictResolutionService.resolveConflict(conflictId, resolvedData, strategy);
      
      if (success) {
        toast({
          title: "Conflit résolu",
          description: "Le conflit a été résolu avec succès",
        });
        await refreshConflicts();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de résoudre le conflit",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      logger.error('Error resolving conflict:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la résolution du conflit",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshConflicts]);

  const autoResolveConflicts = useCallback(async (
    strategy: ConflictResolutionStrategy
  ): Promise<{ resolved: number; failed: number }> => {
    try {
      setIsLoading(true);
      const result = await ConflictResolutionService.autoResolveConflicts(agencyId, strategy);
      
      toast({
        title: "Résolution automatique terminée",
        description: `${result.resolved} conflits résolus, ${result.failed} nécessitent une intervention manuelle`,
        variant: result.failed > 0 ? "default" : "default",
      });
      
      await refreshConflicts();
      return result;
    } catch (error) {
      logger.error('Error auto-resolving conflicts:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la résolution automatique",
        variant: "destructive",
      });
      return { resolved: 0, failed: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [agencyId, toast, refreshConflicts]);

  const getConflictHistory = useCallback(async (): Promise<Tables<'sync_conflicts'>[]> => {
    try {
      return await ConflictResolutionService.getConflictHistory(agencyId);
    } catch (error) {
      logger.error('Error fetching conflict history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des conflits",
        variant: "destructive",
      });
      return [];
    }
  }, [agencyId, toast]);

  // Load conflicts on mount and when agencyId changes
  useEffect(() => {
    if (!agencyId) return;
    refreshConflicts();
  }, [agencyId, refreshConflicts]);

  // Auto-refresh conflicts every 2 minutes
  useEffect(() => {
    if (!agencyId) return;
    
    const interval = setInterval(refreshConflicts, 120000);
    return () => clearInterval(interval);
  }, [agencyId, refreshConflicts]);

  return {
    conflicts,
    isLoading,
    resolutionStats,
    resolveConflict,
    autoResolveConflicts,
    refreshConflicts,
    getConflictHistory
  };
};