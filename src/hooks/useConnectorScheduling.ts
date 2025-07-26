import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ApiConnectorService } from '@/services/apiConnectorService';
import { logger } from '@/utils/logger';

export interface ScheduledJob {
  id: string;
  agencyId: string;
  connectorId: string;
  frequency: number; // en heures
  nextRun: Date;
  lastRun?: Date;
  isActive: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
}

export interface SchedulingOptions {
  frequency: number;
  enabled: boolean;
  maxRetries?: number;
  retryDelay?: number; // en minutes
  onlyOnChanges?: boolean; // Ne sync que si des changements sont détectés
}

export const useConnectorScheduling = () => {
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Charger les tâches programmées
  const loadScheduledJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('agency_connectors')
        .select(`
          id,
          agency_id,
          sync_frequency,
          last_sync_at,
          is_active,
          sync_status,
          error_message,
          auth_config
        `)
        .eq('is_active', true);

      if (error) throw error;

      const jobs: ScheduledJob[] = (data || []).map(connector => ({
        id: connector.id,
        agencyId: connector.agency_id,
        connectorId: connector.id,
        frequency: Math.floor(connector.sync_frequency / 3600), // Convertir en heures
        nextRun: calculateNextRun(connector.last_sync_at, connector.sync_frequency),
        lastRun: connector.last_sync_at ? new Date(connector.last_sync_at) : undefined,
        isActive: connector.is_active,
        status: mapSyncStatus(connector.sync_status),
        retryCount: (connector.auth_config as any)?.retryCount || 0,
        maxRetries: (connector.auth_config as any)?.maxRetries || 3,
        errorMessage: connector.error_message
      }));

      setScheduledJobs(jobs);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches programmées",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Créer ou mettre à jour une tâche programmée
  const scheduleConnector = useCallback(async (
    agencyId: string, 
    connectorId: string, 
    options: SchedulingOptions
  ) => {
    try {
      const { error } = await supabase
        .from('agency_connectors')
        .update({
          sync_frequency: options.frequency * 3600, // Convertir en secondes
          is_active: options.enabled,
          auth_config: {
            maxRetries: options.maxRetries || 3,
            retryDelay: options.retryDelay || 5,
            onlyOnChanges: options.onlyOnChanges || false
          }
        })
        .eq('id', connectorId);

      if (error) throw error;

      await loadScheduledJobs();
      
      toast({
        title: "Tâche programmée",
        description: `Synchronisation programmée toutes les ${options.frequency} heures`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de programmer la tâche",
        variant: "destructive"
      });
    }
  }, [loadScheduledJobs, toast]);

  // Désactiver une tâche programmée
  const unscheduleConnector = useCallback(async (connectorId: string) => {
    try {
      const { error } = await supabase
        .from('agency_connectors')
        .update({ is_active: false })
        .eq('id', connectorId);

      if (error) throw error;

      await loadScheduledJobs();
      
      toast({
        title: "Tâche désactivée",
        description: "La synchronisation automatique a été désactivée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver la tâche",
        variant: "destructive"
      });
    }
  }, [loadScheduledJobs, toast]);

  // Exécuter une synchronisation manuelle
  const runSyncNow = useCallback(async (agencyId: string, connectorId: string) => {
    setSyncing(prev => new Set(prev).add(connectorId));
    
    try {
      const result = await ApiConnectorService.syncConnector(agencyId, connectorId);
      
      if (result.success) {
        toast({
          title: "Synchronisation réussie",
          description: `${result.processed || 0} enregistrements traités`,
        });
      } else {
        throw new Error(result.error || 'Synchronisation échouée');
      }
      
      await loadScheduledJobs();
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setSyncing(prev => {
        const next = new Set(prev);
        next.delete(connectorId);
        return next;
      });
    }
  }, [loadScheduledJobs, toast]);

  // Obtenir les tâches qui doivent être exécutées
  const getDueJobs = useCallback(() => {
    const now = new Date();
    return scheduledJobs.filter(job => 
      job.isActive && 
      job.status !== 'running' && 
      job.nextRun <= now
    );
  }, [scheduledJobs]);

  // Obtenir les statistiques des tâches
  const getJobStats = useCallback(() => {
    const total = scheduledJobs.length;
    const active = scheduledJobs.filter(job => job.isActive).length;
    const pending = scheduledJobs.filter(job => job.status === 'pending').length;
    const running = scheduledJobs.filter(job => job.status === 'running').length;
    const failed = scheduledJobs.filter(job => job.status === 'failed').length;
    const dueNow = getDueJobs().length;

    return {
      total,
      active,
      pending,
      running,
      failed,
      dueNow,
      inactive: total - active
    };
  }, [scheduledJobs, getDueJobs]);

  // Auto-refresh des tâches
  useEffect(() => {
    loadScheduledJobs();
    
    const interval = setInterval(loadScheduledJobs, 60000); // Refresh toutes les minutes
    
    return () => clearInterval(interval);
  }, [loadScheduledJobs]);

  // Simuler l'exécution automatique des tâches dues
  useEffect(() => {
    const executeAutomaticSync = async () => {
      const dueJobs = getDueJobs();
      
      for (const job of dueJobs) {
        if (!syncing.has(job.connectorId)) {
          logger.info(`Exécution automatique de la synchronisation pour ${job.connectorId}`, { component: 'ConnectorScheduling', connectorId: job.connectorId });
          await runSyncNow(job.agencyId, job.connectorId);
        }
      }
    };

    const interval = setInterval(executeAutomaticSync, 300000); // Vérifier toutes les 5 minutes
    
    return () => clearInterval(interval);
  }, [getDueJobs, syncing, runSyncNow]);

  return {
    scheduledJobs,
    loading,
    syncing,
    scheduleConnector,
    unscheduleConnector,
    runSyncNow,
    getDueJobs,
    getJobStats,
    refetch: loadScheduledJobs
  };
};

// Fonctions utilitaires
function calculateNextRun(lastSync: string | null, frequency: number): Date {
  const now = new Date();
  
  if (!lastSync) {
    return now; // Première exécution immédiate
  }
  
  const lastSyncDate = new Date(lastSync);
  const nextRun = new Date(lastSyncDate.getTime() + frequency * 1000);
  
  return nextRun > now ? nextRun : now;
}

function mapSyncStatus(status: string | null): ScheduledJob['status'] {
  switch (status) {
    case 'running':
      return 'running';
    case 'synced':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}