import { useState, useEffect, useCallback } from 'react';
import { BidirectionalSyncService, type BidirectionalSyncConfig, type SyncResult } from '@/services/bidirectionalSyncService';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import type { Tables } from '@/integrations/supabase/types';

interface UseBidirectionalSyncReturn {
  activeSessions: Tables<'sync_sessions'>[];
  isLoading: boolean;
  startSync: (config: BidirectionalSyncConfig) => Promise<SyncResult>;
  stopSync: (sessionId: string) => Promise<boolean>;
  refreshSessions: () => Promise<void>;
  syncInProgress: boolean;
}

export const useBidirectionalSync = (agencyId: string): UseBidirectionalSyncReturn => {
  const [activeSessions, setActiveSessions] = useState<Tables<'sync_sessions'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { toast } = useToast();

  const refreshSessions = useCallback(async () => {
    if (!agencyId) return;
    
    try {
      setIsLoading(true);
      const sessions = await BidirectionalSyncService.getActiveSyncSessions(agencyId);
      setActiveSessions(sessions);
    } catch (error) {
      logger.error('Error refreshing sync sessions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions de synchronisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [agencyId, toast]);

  const startSync = useCallback(async (config: BidirectionalSyncConfig): Promise<SyncResult> => {
    setSyncInProgress(true);
    
    try {
      const result = await BidirectionalSyncService.startBidirectionalSync(config);
      
      if (result.success) {
        toast({
          title: "Synchronisation réussie",
          description: `${result.operationsProcessed} opérations traitées${result.conflictsDetected > 0 ? `, ${result.conflictsDetected} conflits détectés` : ''}`,
        });
      } else {
        toast({
          title: "Synchronisation échouée",
          description: result.errors.join(', '),
          variant: "destructive",
        });
      }
      
      // Refresh sessions after sync
      await refreshSessions();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de synchronisation",
        description: errorMessage,
        variant: "destructive",
      });
      
      return {
        success: false,
        operationsProcessed: 0,
        conflictsDetected: 0,
        errors: [errorMessage],
        syncSessionId: ''
      };
    } finally {
      setSyncInProgress(false);
    }
  }, [toast, refreshSessions]);

  const stopSync = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const success = await BidirectionalSyncService.stopSyncSession(sessionId);
      
      if (success) {
        toast({
          title: "Session arrêtée",
          description: "La session de synchronisation a été arrêtée avec succès",
        });
        await refreshSessions();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'arrêter la session de synchronisation",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      logger.error('Error stopping sync session:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'arrêt de la session",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshSessions]);

  // Auto-refresh sessions every 30 seconds
  useEffect(() => {
    if (!agencyId) return;
    
    refreshSessions();
    
    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, [agencyId, refreshSessions]);

  return {
    activeSessions,
    isLoading,
    startSync,
    stopSync,
    refreshSessions,
    syncInProgress
  };
};