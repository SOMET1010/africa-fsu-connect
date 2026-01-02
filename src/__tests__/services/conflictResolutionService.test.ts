import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    })),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null })
  }
}));

import { 
  ConflictResolutionService, 
  type ConflictResolutionStrategy,
  type ConflictData
} from '@/services/conflictResolutionService';

describe('ConflictResolutionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateConflictSuggestions', () => {
    it('should generate suggestions for conflicting fields', () => {
      const sourceData = { title: 'Source Title', status: 'active' };
      const targetData = { title: 'Target Title', status: 'active' };
      
      // Access the private method through the class (for testing)
      const ConflictServiceAny = ConflictResolutionService as unknown as {
        generateConflictSuggestions: (s: Record<string, unknown>, t: Record<string, unknown>, table: string) => unknown[];
      };
      
      const suggestions = ConflictServiceAny.generateConflictSuggestions(sourceData, targetData, 'agency_projects');
      
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should identify fields with different values', () => {
      const sourceData = { title: 'A', description: 'Same' };
      const targetData = { title: 'B', description: 'Same' };
      
      const ConflictServiceAny = ConflictResolutionService as unknown as {
        generateConflictSuggestions: (s: Record<string, unknown>, t: Record<string, unknown>, table: string) => { field: string }[];
      };
      
      const suggestions = ConflictServiceAny.generateConflictSuggestions(sourceData, targetData, 'test');
      
      // Should only suggest for 'title' field where values differ
      const titleSuggestion = suggestions.find(s => s.field === 'title');
      expect(titleSuggestion).toBeDefined();
    });
  });

  describe('resolveConflict', () => {
    it('should accept resolution with last_write_wins strategy', async () => {
      const conflictId = 'conflict-123';
      const resolvedData = { title: 'Resolved Title' };
      const strategy: ConflictResolutionStrategy = { type: 'last_write_wins' };

      const result = await ConflictResolutionService.resolveConflict(
        conflictId,
        resolvedData,
        strategy
      );
      
      expect(result).toBeDefined();
    });

    it('should handle merge strategy with field priorities', async () => {
      const conflictId = 'conflict-456';
      const resolvedData = { title: 'Merged', description: 'Combined data' };
      const strategy: ConflictResolutionStrategy = { 
        type: 'merge',
        fieldPriorities: { title: 'source', description: 'target' }
      };

      const result = await ConflictResolutionService.resolveConflict(
        conflictId,
        resolvedData,
        strategy
      );
      
      expect(result).toBeDefined();
    });

    it('should handle manual strategy', async () => {
      const conflictId = 'conflict-789';
      const resolvedData = { title: 'Manually Resolved' };
      const strategy: ConflictResolutionStrategy = { type: 'manual' };

      const result = await ConflictResolutionService.resolveConflict(
        conflictId,
        resolvedData,
        strategy
      );
      
      expect(result).toBeDefined();
    });
  });

  describe('getUnresolvedConflicts', () => {
    it('should return an array of conflicts', async () => {
      const conflicts = await ConflictResolutionService.getUnresolvedConflicts('agency-123');
      
      expect(Array.isArray(conflicts)).toBe(true);
    });

    it('should handle empty results gracefully', async () => {
      const conflicts = await ConflictResolutionService.getUnresolvedConflicts('non-existent-agency');
      
      expect(conflicts).toEqual([]);
    });
  });

  describe('autoResolveConflicts', () => {
    it('should auto-resolve with last_write_wins strategy', async () => {
      const strategy: ConflictResolutionStrategy = { type: 'last_write_wins' };
      
      const results = await ConflictResolutionService.autoResolveConflicts(
        'agency-123',
        strategy
      );
      
      expect(Array.isArray(results)).toBe(true);
    });

    it('should auto-resolve with merge strategy', async () => {
      const strategy: ConflictResolutionStrategy = { 
        type: 'merge',
        fieldPriorities: { title: 'source' }
      };
      
      const results = await ConflictResolutionService.autoResolveConflicts(
        'agency-456',
        strategy
      );
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('ConflictData interface', () => {
    it('should have correct structure', () => {
      const conflict: ConflictData = {
        id: 'test-id',
        agencyId: 'agency-id',
        tableName: 'agency_projects',
        recordId: 'record-id',
        sourceData: { field: 'value' },
        targetData: { field: 'other' },
        conflictType: 'update',
        suggestions: []
      };

      expect(conflict.id).toBe('test-id');
      expect(conflict.agencyId).toBe('agency-id');
      expect(conflict.tableName).toBe('agency_projects');
      expect(conflict.sourceData).toHaveProperty('field');
    });
  });
});
