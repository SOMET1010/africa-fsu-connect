import { supabase } from '@/integrations/supabase/client';
import { ApiConnectorService, type ApiConnector } from './apiConnectorService';
import type { Tables, Json } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import { 
  type SyncRecordData, 
  type SyncConflict, 
  getErrorMessage,
  toJson 
} from '@/types/sync.types';

export interface BidirectionalSyncConfig {
  agencyId: string;
  connectorId: string;
  sourceEndpoint: string;
  targetEndpoint: string;
  bidirectionalMappings: {
    sourceToTarget: Record<string, string>;
    targetToSource: Record<string, string>;
  };
  conflictResolution: 'last_write_wins' | 'manual' | 'merge';
  syncDirection: 'source_to_target' | 'target_to_source' | 'bidirectional';
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  tableName: string;
  recordId: string;
  data: SyncRecordData;
  timestamp: string;
  source: 'local' | 'remote';
  conflicts?: SyncConflict[];
}

export interface SyncResult {
  success: boolean;
  operationsProcessed: number;
  conflictsDetected: number;
  errors: string[];
  syncSessionId: string;
}

export class BidirectionalSyncService {
  static async startBidirectionalSync(config: BidirectionalSyncConfig): Promise<SyncResult> {
    try {
      // Create sync session
      const { data: session, error: sessionError } = await supabase
        .from('sync_sessions')
        .insert({
          agency_id: config.agencyId,
          connector_id: config.connectorId,
          session_type: 'bidirectional',
          status: 'active',
          metadata: toJson(config)
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Get connector details
      const connectors = await ApiConnectorService.getConnectors(config.agencyId);
      const connector = connectors.find(c => c.id === config.connectorId);
      
      if (!connector) {
        throw new Error('Connector not found');
      }

      // Perform bidirectional sync
      const result = await this.performBidirectionalSync(config, connector, session.id);

      // Update session with results
      await supabase
        .from('sync_sessions')
        .update({
          status: result.success ? 'completed' : 'failed',
          ended_at: new Date().toISOString(),
          records_processed: result.operationsProcessed,
          conflicts_detected: result.conflictsDetected
        })
        .eq('id', session.id);

      return {
        ...result,
        syncSessionId: session.id
      };
    } catch (error) {
      logger.error('Bidirectional sync failed:', getErrorMessage(error));
      return {
        success: false,
        operationsProcessed: 0,
        conflictsDetected: 0,
        errors: [getErrorMessage(error)],
        syncSessionId: ''
      };
    }
  }

  private static async performBidirectionalSync(
    config: BidirectionalSyncConfig,
    connector: ApiConnector,
    sessionId: string
  ): Promise<Omit<SyncResult, 'syncSessionId'>> {
    const operations: SyncOperation[] = [];
    const conflicts: SyncConflict[] = [];
    let operationsProcessed = 0;

    try {
      // Detect changes from source
      if (config.syncDirection === 'source_to_target' || config.syncDirection === 'bidirectional') {
        const sourceChanges = await this.detectSourceChanges(config, connector);
        operations.push(...sourceChanges);
      }

      // Detect changes from target
      if (config.syncDirection === 'target_to_source' || config.syncDirection === 'bidirectional') {
        const targetChanges = await this.detectTargetChanges(config, connector);
        operations.push(...targetChanges);
      }

      // Process operations and detect conflicts
      for (const operation of operations) {
        try {
          const conflict = await this.detectConflicts(operation, config);
          if (conflict) {
            conflicts.push(conflict);
            // Store conflict in database
            await this.storeConflict(conflict, config.agencyId);
          } else {
            await this.applyOperation(operation, config, connector);
            operationsProcessed++;
          }
        } catch (error) {
          logger.error('Error processing operation:', getErrorMessage(error));
        }
      }

      // Version all changes
      await this.createDataVersions(operations, sessionId);

      return {
        success: conflicts.length === 0,
        operationsProcessed,
        conflictsDetected: conflicts.length,
        errors: []
      };
    } catch (error) {
      logger.error('Bidirectional sync error:', getErrorMessage(error));
      return {
        success: false,
        operationsProcessed,
        conflictsDetected: conflicts.length,
        errors: [getErrorMessage(error)]
      };
    }
  }

  private static async detectSourceChanges(
    config: BidirectionalSyncConfig,
    connector: ApiConnector
  ): Promise<SyncOperation[]> {
    try {
      // Fetch recent changes from source API
      const response = await fetch(config.sourceEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${connector.authConfig?.bearerToken ?? ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Source API error: ${response.status}`);
      }

      const data: SyncRecordData[] = await response.json();
      
      // Convert to sync operations
      return this.convertToSyncOperations(data, 'remote', config);
    } catch (error) {
      logger.error('Error detecting source changes:', getErrorMessage(error));
      return [];
    }
  }

  private static async detectTargetChanges(
    config: BidirectionalSyncConfig,
    connector: ApiConnector
  ): Promise<SyncOperation[]> {
    try {
      // Fetch recent changes from target (usually our local database)
      const { data: localData, error } = await supabase
        .from('agency_projects')
        .select('*')
        .eq('agency_id', config.agencyId)
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Convert to sync operations
      return this.convertToSyncOperations(localData || [], 'local', config);
    } catch (error) {
      logger.error('Error detecting target changes:', getErrorMessage(error));
      return [];
    }
  }

  private static convertToSyncOperations(
    data: SyncRecordData[],
    source: 'local' | 'remote',
    config: BidirectionalSyncConfig
  ): SyncOperation[] {
    return data.map((item, index) => ({
      id: `${source}_${index}_${Date.now()}`,
      type: 'update' as const,
      tableName: source === 'local' ? 'agency_projects' : 'external_data',
      recordId: (item.id ?? item.external_id ?? `temp_${index}`) as string,
      data: item,
      timestamp: (item.updated_at ?? new Date().toISOString()) as string,
      source
    }));
  }

  private static async detectConflicts(
    operation: SyncOperation,
    config: BidirectionalSyncConfig
  ): Promise<SyncConflict | null> {
    try {
      // Only check conflicts for agency_projects table (skip external_data)
      if (operation.tableName !== 'agency_projects') {
        return null;
      }

      // Check if record exists with newer timestamp
      const { data: existingRecord } = await supabase
        .from('agency_projects')
        .select('*')
        .eq('id', operation.recordId)
        .maybeSingle();

      if (existingRecord && existingRecord.updated_at > operation.timestamp) {
        return {
          record_id: operation.recordId,
          table_name: operation.tableName,
          source_data: operation.data as Record<string, unknown>,
          target_data: existingRecord as unknown as Record<string, unknown>,
          conflict_type: 'timestamp_conflict'
        };
      }

      return null;
    } catch (error) {
      logger.error('Error detecting conflicts:', getErrorMessage(error));
      return null;
    }
  }

  private static async storeConflict(conflict: SyncConflict, agencyId: string): Promise<void> {
    try {
      await supabase
        .from('sync_conflicts')
        .insert({
          agency_id: agencyId,
          table_name: conflict.table_name,
          record_id: conflict.record_id,
          source_data: conflict.source_data as Json,
          target_data: conflict.target_data as Json,
          conflict_type: conflict.conflict_type
        });
    } catch (error) {
      logger.error('Error storing conflict:', getErrorMessage(error));
    }
  }

  private static async applyOperation(
    operation: SyncOperation,
    config: BidirectionalSyncConfig,
    connector: ApiConnector
  ): Promise<void> {
    try {
      if (operation.source === 'remote') {
        // Apply remote changes to local database (only handle agency_projects)
        if (operation.tableName === 'agency_projects') {
          const mappedData = this.mapData(
            operation.data,
            config.bidirectionalMappings.sourceToTarget
          );

          if (operation.type === 'create') {
            await supabase
              .from('agency_projects')
              .insert([mappedData] as never);
          } else if (operation.type === 'update') {
            await supabase
              .from('agency_projects')
              .upsert([mappedData] as never);
          } else if (operation.type === 'delete') {
            await supabase
              .from('agency_projects')
              .delete()
              .eq('id', operation.recordId);
          }
        }
      } else {
        // Apply local changes to remote API
        const mappedData = this.mapData(
          operation.data,
          config.bidirectionalMappings.targetToSource
        );

        const response = await fetch(config.targetEndpoint, {
          method: operation.type === 'delete' ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${connector.authConfig?.bearerToken ?? ''}`,
            'Content-Type': 'application/json'
          },
          body: operation.type !== 'delete' ? JSON.stringify(mappedData) : undefined
        });

        if (!response.ok) {
          throw new Error(`Remote API error: ${response.status}`);
        }
      }
    } catch (error) {
      logger.error('Error applying operation:', getErrorMessage(error));
      throw error;
    }
  }

  private static mapData(
    data: SyncRecordData, 
    mapping: Record<string, string>
  ): Record<string, unknown> {
    const mappedData: Record<string, unknown> = {};
    
    for (const [sourceField, targetField] of Object.entries(mapping)) {
      if (data[sourceField] !== undefined) {
        mappedData[targetField] = data[sourceField];
      }
    }

    return mappedData;
  }

  private static async createDataVersions(
    operations: SyncOperation[],
    sessionId: string
  ): Promise<void> {
    try {
      const versions = operations.map(op => ({
        table_name: op.tableName,
        record_id: op.recordId,
        version_number: 1, // This should be incremented based on existing versions
        data_snapshot: op.data as Json,
        sync_id: sessionId,
        change_type: op.type
      }));

      if (versions.length > 0) {
        await supabase
          .from('data_versions')
          .insert(versions);
      }
    } catch (error) {
      logger.error('Error creating data versions:', getErrorMessage(error));
    }
  }

  static async getActiveSyncSessions(agencyId: string): Promise<Tables<'sync_sessions'>[]> {
    try {
      const { data, error } = await supabase
        .from('sync_sessions')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching active sync sessions:', getErrorMessage(error));
      return [];
    }
  }

  static async stopSyncSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sync_sessions')
        .update({
          status: 'stopped',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return !error;
    } catch (error) {
      logger.error('Error stopping sync session:', getErrorMessage(error));
      return false;
    }
  }
}
