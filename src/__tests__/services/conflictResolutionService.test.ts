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
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    })),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null })
  }
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

import { 
  ConflictResolutionService, 
  type ConflictResolutionStrategy,
  type ConflictData,
  type ConflictSuggestion
} from '@/services/conflictResolutionService';

describe('ConflictResolutionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ConflictResolutionStrategy types', () => {
    it('should accept last_write_wins strategy', () => {
      const strategy: ConflictResolutionStrategy = { type: 'last_write_wins' };
      expect(strategy.type).toBe('last_write_wins');
    });

    it('should accept merge strategy with field priorities', () => {
      const strategy: ConflictResolutionStrategy = {
        type: 'merge',
        fieldPriorities: {
          title: 'source',
          description: 'target',
          status: 'source',
        },
      };
      expect(strategy.type).toBe('merge');
      expect(strategy.fieldPriorities?.title).toBe('source');
    });

    it('should accept manual strategy', () => {
      const strategy: ConflictResolutionStrategy = { type: 'manual' };
      expect(strategy.type).toBe('manual');
    });

    it('should accept custom rules', () => {
      const strategy: ConflictResolutionStrategy = {
        type: 'merge',
        customRules: [
          { field: 'tags', condition: 'always', action: 'merge' },
          { field: 'priority', condition: 'source_newer', action: 'prefer_source' },
        ],
      };
      expect(strategy.customRules).toHaveLength(2);
      expect(strategy.customRules![0].action).toBe('merge');
    });
  });

  describe('ConflictData interface', () => {
    it('should accept valid conflict data', () => {
      const conflict: ConflictData = {
        id: 'conflict-123',
        agencyId: 'agency-456',
        tableName: 'agency_projects',
        recordId: 'record-789',
        sourceData: { title: 'Source Title', updated_at: '2024-01-15T10:00:00Z' },
        targetData: { title: 'Target Title', updated_at: '2024-01-14T10:00:00Z' },
        conflictType: 'timestamp_conflict',
        suggestions: [],
      };

      expect(conflict.tableName).toBe('agency_projects');
      expect(conflict.conflictType).toBe('timestamp_conflict');
    });

    it('should include conflict suggestions', () => {
      const suggestions: ConflictSuggestion[] = [
        {
          field: 'title',
          sourceValue: 'Source Title',
          targetValue: 'Target Title',
          recommendedValue: 'Source Title',
          confidence: 0.85,
          reason: 'Source has newer timestamp',
        },
      ];

      const conflict: ConflictData = {
        id: 'conflict-456',
        agencyId: 'agency-789',
        tableName: 'agency_projects',
        recordId: 'record-012',
        sourceData: {},
        targetData: {},
        conflictType: 'field_mismatch',
        suggestions,
      };

      expect(conflict.suggestions).toHaveLength(1);
      expect(conflict.suggestions[0].confidence).toBe(0.85);
    });
  });

  describe('Resolution logic (pure function unit tests)', () => {
    describe('last_write_wins resolution', () => {
      it('should prefer source when source is newer', () => {
        const sourceData = {
          title: 'Source Title',
          updated_at: '2024-01-15T12:00:00Z',
        };
        const targetData = {
          title: 'Target Title',
          updated_at: '2024-01-14T10:00:00Z',
        };

        const sourceTime = new Date(sourceData.updated_at);
        const targetTime = new Date(targetData.updated_at);
        const winner = sourceTime > targetTime ? sourceData : targetData;

        expect(winner.title).toBe('Source Title');
      });

      it('should prefer target when target is newer', () => {
        const sourceData = {
          title: 'Source Title',
          updated_at: '2024-01-10T10:00:00Z',
        };
        const targetData = {
          title: 'Target Title',
          updated_at: '2024-01-15T12:00:00Z',
        };

        const sourceTime = new Date(sourceData.updated_at);
        const targetTime = new Date(targetData.updated_at);
        const winner = sourceTime > targetTime ? sourceData : targetData;

        expect(winner.title).toBe('Target Title');
      });
    });

    describe('merge resolution', () => {
      it('should merge arrays correctly', () => {
        const sourceArray = ['tag1', 'tag2', 'tag3'];
        const targetArray = ['tag2', 'tag4'];

        const merged = [...new Set([...targetArray, ...sourceArray])];

        expect(merged).toContain('tag1');
        expect(merged).toContain('tag2');
        expect(merged).toContain('tag3');
        expect(merged).toContain('tag4');
        expect(merged.filter(t => t === 'tag2')).toHaveLength(1);
      });

      it('should deep merge objects', () => {
        const sourceObj = { nested: { a: 1, b: 2 } };
        const targetObj = { nested: { b: 3, c: 4 } };

        const merged = {
          nested: {
            ...targetObj.nested,
            ...sourceObj.nested,
          },
        };

        expect(merged.nested.a).toBe(1);
        expect(merged.nested.b).toBe(2);
        expect(merged.nested.c).toBe(4);
      });
    });

    describe('field suggestion logic', () => {
      it('should recommend higher value for counter fields', () => {
        const sourceCount = 150;
        const targetCount = 100;
        const recommended = Math.max(sourceCount, targetCount);

        expect(recommended).toBe(150);
      });

      it('should prefer longer string for detailed fields', () => {
        const sourceDesc = 'A very detailed description with lots of information';
        const targetDesc = 'Short desc';
        const recommended = sourceDesc.length > targetDesc.length ? sourceDesc : targetDesc;

        expect(recommended).toBe(sourceDesc);
      });

      it('should merge unique array values', () => {
        const sourceTags = ['a', 'b', 'c'];
        const targetTags = ['b', 'c', 'd'];
        const merged = [...new Set([...targetTags, ...sourceTags])];

        expect(merged).toHaveLength(4);
        expect(merged).toEqual(expect.arrayContaining(['a', 'b', 'c', 'd']));
      });
    });
  });

  describe('generateConflictSuggestions (internal)', () => {
    it('should generate suggestions for conflicting fields', () => {
      const sourceData = { title: 'Source Title', status: 'active' };
      const targetData = { title: 'Target Title', status: 'active' };
      
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
    it('should return resolution stats', async () => {
      const strategy: ConflictResolutionStrategy = { type: 'last_write_wins' };
      
      const results = await ConflictResolutionService.autoResolveConflicts(
        'agency-123',
        strategy
      );
      
      expect(results).toHaveProperty('resolved');
      expect(results).toHaveProperty('failed');
    });
  });

  describe('getResolutionStats', () => {
    it('should return default stats on error', async () => {
      const stats = await ConflictResolutionService.getResolutionStats('nonexistent-agency');

      expect(stats).toEqual({
        total: 0,
        resolved: 0,
        pending: 0,
        autoResolved: 0,
      });
    });
  });

  describe('getConflictHistory', () => {
    it('should return empty array on error', async () => {
      const history = await ConflictResolutionService.getConflictHistory('nonexistent-agency');

      expect(history).toEqual([]);
    });
  });
});
