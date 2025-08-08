import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

export interface ConflictResolutionStrategy {
  type: 'last_write_wins' | 'merge' | 'manual';
  fieldPriorities?: Record<string, 'source' | 'target'>;
  customRules?: ConflictRule[];
}

export interface ConflictRule {
  field: string;
  condition: string;
  action: 'prefer_source' | 'prefer_target' | 'merge' | 'require_manual';
}

export interface ConflictData {
  id: string;
  agencyId: string;
  tableName: string;
  recordId: string;
  sourceData: any;
  targetData: any;
  conflictType: string;
  suggestions: ConflictSuggestion[];
}

export interface ConflictSuggestion {
  field: string;
  sourceValue: any;
  targetValue: any;
  recommendedValue: any;
  confidence: number;
  reason: string;
}

export interface ConflictResolution {
  conflictId: string;
  resolvedData: any;
  strategy: string;
  autoResolved: boolean;
}

export class ConflictResolutionService {
  static async getUnresolvedConflicts(agencyId: string): Promise<ConflictData[]> {
    try {
      const { data, error } = await supabase
        .from('sync_conflicts')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(conflict => ({
        id: conflict.id,
        agencyId: conflict.agency_id,
        tableName: conflict.table_name,
        recordId: conflict.record_id,
        sourceData: conflict.source_data,
        targetData: conflict.target_data,
        conflictType: conflict.conflict_type,
        suggestions: this.generateConflictSuggestions(
          conflict.source_data,
          conflict.target_data,
          conflict.table_name
        )
      }));
    } catch (error) {
      logger.error('Error fetching unresolved conflicts:', error as any);
      return [];
    }
  }

  static async resolveConflict(
    conflictId: string,
    resolvedData: any,
    strategy: ConflictResolutionStrategy
  ): Promise<boolean> {
    try {
      // Update conflict as resolved
      const { error: updateError } = await supabase
        .from('sync_conflicts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_data: resolvedData,
          resolution_strategy: strategy.type
        })
        .eq('id', conflictId);

      if (updateError) throw updateError;

      // Get conflict details to apply the resolution
      const { data: conflict, error: fetchError } = await supabase
        .from('sync_conflicts')
        .select('*')
        .eq('id', conflictId)
        .single();

      if (fetchError) throw fetchError;

      // Apply the resolved data to the target table
      await this.applyResolvedData(conflict, resolvedData);

      // Create data version for the resolution
      await this.createResolutionVersion(conflict, resolvedData);

      return true;
    } catch (error) {
      logger.error('Error resolving conflict:', error as any);
      return false;
    }
  }

  static async autoResolveConflicts(
    agencyId: string,
    strategy: ConflictResolutionStrategy
  ): Promise<{ resolved: number; failed: number }> {
    try {
      const conflicts = await this.getUnresolvedConflicts(agencyId);
      let resolved = 0;
      let failed = 0;

      for (const conflict of conflicts) {
        try {
          const resolvedData = await this.applyResolutionStrategy(conflict, strategy);
          
          if (resolvedData) {
            const success = await this.resolveConflict(conflict.id, resolvedData, strategy);
            if (success) {
              resolved++;
            } else {
              failed++;
            }
          } else {
            // Conflict requires manual resolution
            failed++;
          }
        } catch (error) {
          logger.error('Error auto-resolving conflict:', error as any);
          failed++;
        }
      }

      return { resolved, failed };
    } catch (error) {
      logger.error('Error in auto-resolve conflicts:', error as any);
      return { resolved: 0, failed: 0 };
    }
  }

  private static async applyResolutionStrategy(
    conflict: ConflictData,
    strategy: ConflictResolutionStrategy
  ): Promise<any | null> {
    switch (strategy.type) {
      case 'last_write_wins':
        return this.resolveLastWriteWins(conflict);
      
      case 'merge':
        return this.resolveMerge(conflict, strategy);
      
      case 'manual':
        return null; // Requires manual intervention
      
      default:
        return null;
    }
  }

  private static resolveLastWriteWins(conflict: ConflictData): any {
    // Compare timestamps and use the most recent data
    const sourceTimestamp = new Date(conflict.sourceData.updated_at || conflict.sourceData.created_at);
    const targetTimestamp = new Date(conflict.targetData.updated_at || conflict.targetData.created_at);

    return sourceTimestamp > targetTimestamp ? conflict.sourceData : conflict.targetData;
  }

  private static resolveMerge(
    conflict: ConflictData,
    strategy: ConflictResolutionStrategy
  ): any {
    const mergedData = { ...conflict.targetData };
    
    // Apply field priorities
    if (strategy.fieldPriorities) {
      for (const [field, priority] of Object.entries(strategy.fieldPriorities)) {
        if (priority === 'source' && conflict.sourceData[field] !== undefined) {
          mergedData[field] = conflict.sourceData[field];
        } else if (priority === 'target' && conflict.targetData[field] !== undefined) {
          mergedData[field] = conflict.targetData[field];
        }
      }
    }

    // Apply custom rules
    if (strategy.customRules) {
      for (const rule of strategy.customRules) {
        mergedData[rule.field] = this.applyCustomRule(rule, conflict);
      }
    }

    // Merge arrays and objects intelligently
    for (const [key, sourceValue] of Object.entries(conflict.sourceData)) {
      if (mergedData[key] === undefined) {
        mergedData[key] = sourceValue;
      } else if (Array.isArray(sourceValue) && Array.isArray(mergedData[key])) {
        // Merge arrays by combining unique values
        mergedData[key] = [...new Set([...mergedData[key], ...sourceValue])];
      } else if (typeof sourceValue === 'object' && typeof mergedData[key] === 'object') {
        // Deep merge objects
        mergedData[key] = { ...mergedData[key], ...sourceValue };
      }
    }

    return mergedData;
  }

  private static applyCustomRule(rule: ConflictRule, conflict: ConflictData): any {
    const sourceValue = conflict.sourceData[rule.field];
    const targetValue = conflict.targetData[rule.field];

    switch (rule.action) {
      case 'prefer_source':
        return sourceValue;
      case 'prefer_target':
        return targetValue;
      case 'merge':
        if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
          return [...new Set([...targetValue, ...sourceValue])];
        }
        return sourceValue || targetValue;
      default:
        return targetValue;
    }
  }

  private static generateConflictSuggestions(
    sourceData: any,
    targetData: any,
    tableName: string
  ): ConflictSuggestion[] {
    const suggestions: ConflictSuggestion[] = [];
    const allFields = new Set([...Object.keys(sourceData), ...Object.keys(targetData)]);

    for (const field of allFields) {
      const sourceValue = sourceData[field];
      const targetValue = targetData[field];

      if (sourceValue !== targetValue) {
        const suggestion = this.generateFieldSuggestion(field, sourceValue, targetValue, tableName);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }

    return suggestions;
  }

  private static generateFieldSuggestion(
    field: string,
    sourceValue: any,
    targetValue: any,
    tableName: string
  ): ConflictSuggestion | null {
    // Generate intelligent suggestions based on field type and context
    let recommendedValue = targetValue;
    let confidence = 0.5;
    let reason = 'Default to target value';

    // Timestamp fields - prefer newer
    if (field.includes('updated_at') || field.includes('modified')) {
      const sourceTime = new Date(sourceValue);
      const targetTime = new Date(targetValue);
      if (sourceTime > targetTime) {
        recommendedValue = sourceValue;
        confidence = 0.9;
        reason = 'Source has newer timestamp';
      } else {
        confidence = 0.9;
        reason = 'Target has newer timestamp';
      }
    }
    // Numeric fields - prefer higher values for counters
    else if (typeof sourceValue === 'number' && typeof targetValue === 'number') {
      if (field.includes('count') || field.includes('total') || field.includes('sum')) {
        recommendedValue = Math.max(sourceValue, targetValue);
        confidence = 0.8;
        reason = 'Higher value for counter field';
      }
    }
    // String fields - prefer non-empty values
    else if (typeof sourceValue === 'string' && typeof targetValue === 'string') {
      if (sourceValue.length > targetValue.length) {
        recommendedValue = sourceValue;
        confidence = 0.7;
        reason = 'Source has more detailed information';
      }
    }
    // Array fields - merge
    else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      recommendedValue = [...new Set([...targetValue, ...sourceValue])];
      confidence = 0.8;
      reason = 'Merged unique values from both sources';
    }

    return {
      field,
      sourceValue,
      targetValue,
      recommendedValue,
      confidence,
      reason
    };
  }

  private static async applyResolvedData(conflict: any, resolvedData: any): Promise<void> {
    try {
      await supabase
        .from(conflict.table_name)
        .upsert({
          id: conflict.record_id,
          ...resolvedData,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Error applying resolved data:', error as any);
      throw error;
    }
  }

  private static async createResolutionVersion(conflict: any, resolvedData: any): Promise<void> {
    try {
      await supabase
        .from('data_versions')
        .insert({
          table_name: conflict.table_name,
          record_id: conflict.record_id,
          version_number: 1, // Should be incremented
          data_snapshot: resolvedData,
          change_type: 'conflict_resolution'
        });
    } catch (error) {
      logger.error('Error creating resolution version:', error as any);
    }
  }

  static async getConflictHistory(agencyId: string, limit = 50): Promise<Tables<'sync_conflicts'>[]> {
    try {
      const { data, error } = await supabase
        .from('sync_conflicts')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching conflict history:', error as any);
      return [];
    }
  }

  static async getResolutionStats(agencyId: string): Promise<{
    total: number;
    resolved: number;
    pending: number;
    autoResolved: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('sync_conflicts')
        .select('is_resolved, resolution_strategy')
        .eq('agency_id', agencyId);

      if (error) throw error;

      const total = data?.length || 0;
      const resolved = data?.filter(c => c.is_resolved).length || 0;
      const pending = total - resolved;
      const autoResolved = data?.filter(c => 
        c.is_resolved && c.resolution_strategy !== 'manual'
      ).length || 0;

      return { total, resolved, pending, autoResolved };
    } catch (error) {
      logger.error('Error fetching resolution stats:', error as any);
      return { total: 0, resolved: 0, pending: 0, autoResolved: 0 };
    }
  }
}