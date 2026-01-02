import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BidirectionalSyncService, type BidirectionalSyncConfig, type SyncOperation } from '@/services/bidirectionalSyncService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      update: vi.fn(() => ({ eq: vi.fn() })),
      select: vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn() })) })) })),
    })),
  },
}));

// Mock ApiConnectorService
vi.mock('@/services/apiConnectorService', () => ({
  ApiConnectorService: {
    getConnectors: vi.fn(() => []),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('BidirectionalSyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SyncConfig types', () => {
    it('should accept valid sync config', () => {
      const config: BidirectionalSyncConfig = {
        agencyId: 'agency-123',
        connectorId: 'connector-456',
        sourceEndpoint: 'https://api.source.com/data',
        targetEndpoint: 'https://api.target.com/data',
        bidirectionalMappings: {
          sourceToTarget: { external_id: 'id', name: 'title' },
          targetToSource: { id: 'external_id', title: 'name' },
        },
        conflictResolution: 'last_write_wins',
        syncDirection: 'bidirectional',
      };

      expect(config.agencyId).toBe('agency-123');
      expect(config.conflictResolution).toBe('last_write_wins');
      expect(config.syncDirection).toBe('bidirectional');
    });

    it('should support all sync directions', () => {
      const directions = ['source_to_target', 'target_to_source', 'bidirectional'] as const;
      
      directions.forEach(direction => {
        const config: BidirectionalSyncConfig = {
          agencyId: 'test',
          connectorId: 'test',
          sourceEndpoint: 'https://api.test.com',
          targetEndpoint: 'https://api.test.com',
          bidirectionalMappings: {
            sourceToTarget: {},
            targetToSource: {},
          },
          conflictResolution: 'manual',
          syncDirection: direction,
        };
        expect(config.syncDirection).toBe(direction);
      });
    });

    it('should support all conflict resolution strategies', () => {
      const strategies = ['last_write_wins', 'manual', 'merge'] as const;
      
      strategies.forEach(strategy => {
        const config: BidirectionalSyncConfig = {
          agencyId: 'test',
          connectorId: 'test',
          sourceEndpoint: 'https://api.test.com',
          targetEndpoint: 'https://api.test.com',
          bidirectionalMappings: {
            sourceToTarget: {},
            targetToSource: {},
          },
          conflictResolution: strategy,
          syncDirection: 'bidirectional',
        };
        expect(config.conflictResolution).toBe(strategy);
      });
    });
  });

  describe('SyncOperation types', () => {
    it('should accept valid sync operation', () => {
      const operation: SyncOperation = {
        id: 'op-123',
        type: 'update',
        tableName: 'agency_projects',
        recordId: 'record-456',
        data: { title: 'Test Project', status: 'active' },
        timestamp: '2024-01-15T10:00:00Z',
        source: 'local',
      };

      expect(operation.type).toBe('update');
      expect(operation.source).toBe('local');
    });

    it('should support all operation types', () => {
      const types = ['create', 'update', 'delete'] as const;
      
      types.forEach(type => {
        const operation: SyncOperation = {
          id: `op-${type}`,
          type,
          tableName: 'test_table',
          recordId: 'rec-123',
          data: {},
          timestamp: new Date().toISOString(),
          source: 'remote',
        };
        expect(operation.type).toBe(type);
      });
    });

    it('should support conflicts array', () => {
      const operation: SyncOperation = {
        id: 'op-with-conflicts',
        type: 'update',
        tableName: 'agency_projects',
        recordId: 'record-789',
        data: { title: 'Conflicted Project' },
        timestamp: '2024-01-15T10:00:00Z',
        source: 'remote',
        conflicts: [
          {
            record_id: 'record-789',
            table_name: 'agency_projects',
            source_data: { title: 'Remote Title' },
            target_data: { title: 'Local Title' },
            conflict_type: 'timestamp_conflict',
          },
        ],
      };

      expect(operation.conflicts).toHaveLength(1);
      expect(operation.conflicts![0].conflict_type).toBe('timestamp_conflict');
    });
  });

  describe('startBidirectionalSync', () => {
    it('should return error result when connector not found', async () => {
      const config: BidirectionalSyncConfig = {
        agencyId: 'agency-123',
        connectorId: 'nonexistent',
        sourceEndpoint: 'https://api.test.com',
        targetEndpoint: 'https://api.test.com',
        bidirectionalMappings: {
          sourceToTarget: {},
          targetToSource: {},
        },
        conflictResolution: 'last_write_wins',
        syncDirection: 'bidirectional',
      };

      const result = await BidirectionalSyncService.startBidirectionalSync(config);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.syncSessionId).toBe('');
    });
  });
});
