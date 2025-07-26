/**
 * CRITICAL TESTS - Core functionality
 */
// @ts-ignore - vitest types
import { describe, it, expect, vi } from 'vitest';
import { logger } from '@/utils/logger';
import { performanceMonitor } from '@/utils/performanceOptimizer';
import { validateData, userPreferencesSchema } from '@/schemas/validation';

// Mock environment
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: { getSession: vi.fn() }
  }
}));

describe('Critical Core Tests', () => {
  describe('Logger', () => {
    it('should format messages correctly', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      logger.error('Test error', new Error('Test'));
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle security logging', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      logger.security('login_attempt', { userId: 'test' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Performance Monitor', () => {
    it('should measure sync operations', () => {
      const result = performanceMonitor.measure('test-operation', () => {
        return 'test-result';
      });
      
      expect(result).toBe('test-result');
      expect(performanceMonitor.getAverage('test-operation')).toBeGreaterThan(0);
    });

    it('should handle async operations', async () => {
      const result = await performanceMonitor.measureAsync('async-test', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async-result';
      });
      
      expect(result).toBe('async-result');
    });
  });

  describe('Validation', () => {
    it('should validate user preferences', () => {
      const validPrefs = {
        theme: 'light',
        language: 'fr',
        dashboardLayout: 'grid',
        notifications: true
      };
      
      expect(() => validateData(userPreferencesSchema, validPrefs)).not.toThrow();
    });

    it('should reject invalid data', () => {
      const invalidPrefs = {
        theme: 'invalid',
        language: 123
      };
      
      expect(() => validateData(userPreferencesSchema, invalidPrefs)).toThrow();
    });
  });
});