import { describe, it, expect } from 'vitest';
import { DataValidationService, type ValidationRule } from '@/services/dataValidationService';

describe('DataValidationService', () => {
  describe('validateData', () => {
    it('should validate required fields correctly', () => {
      const rules: ValidationRule[] = [
        { field: 'title', type: 'required', message: 'Title is required', severity: 'error' },
        { field: 'email', type: 'required', message: 'Email is required', severity: 'error' }
      ];

      const validData = [{ title: 'Test', email: 'test@example.com' }];
      const result = DataValidationService.validateData(validData, undefined, rules);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const rules: ValidationRule[] = [
        { field: 'title', type: 'required', message: 'Title is required', severity: 'error' }
      ];

      const invalidData = [{ title: '' }];
      const result = DataValidationService.validateData(invalidData, undefined, rules);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate format with pattern', () => {
      const rules: ValidationRule[] = [
        { 
          field: 'email', 
          type: 'format', 
          value: '^[^@]+@[^@]+\\.[^@]+$',
          message: 'Invalid email format', 
          severity: 'error' 
        }
      ];

      const validData = [{ email: 'valid@example.com' }];
      const resultValid = DataValidationService.validateData(validData, undefined, rules);
      expect(resultValid.isValid).toBe(true);

      const invalidData = [{ email: 'not-an-email' }];
      const resultInvalid = DataValidationService.validateData(invalidData, undefined, rules);
      expect(resultInvalid.isValid).toBe(false);
    });

    it('should validate numeric ranges', () => {
      const rules: ValidationRule[] = [
        { 
          field: 'age', 
          type: 'range', 
          value: { min: 18, max: 100 },
          message: 'Age must be between 18 and 100', 
          severity: 'error' 
        }
      ];

      const validData = [{ age: 25 }];
      const resultValid = DataValidationService.validateData(validData, undefined, rules);
      expect(resultValid.isValid).toBe(true);

      const tooLow = [{ age: 10 }];
      const resultLow = DataValidationService.validateData(tooLow, undefined, rules);
      expect(resultLow.isValid).toBe(false);

      const tooHigh = [{ age: 150 }];
      const resultHigh = DataValidationService.validateData(tooHigh, undefined, rules);
      expect(resultHigh.isValid).toBe(false);
    });

    it('should return summary statistics', () => {
      const rules: ValidationRule[] = [
        { field: 'name', type: 'required', message: 'Name required', severity: 'error' }
      ];

      const mixedData = [
        { name: 'Valid' },
        { name: '' },
        { name: 'Also Valid' }
      ];

      const result = DataValidationService.validateData(mixedData, undefined, rules);
      
      expect(result.summary.totalRecords).toBe(3);
      expect(result.summary.validRecords).toBe(2);
      expect(result.summary.errorRecords).toBe(1);
    });

    it('should distinguish between errors and warnings', () => {
      const rules: ValidationRule[] = [
        { field: 'critical', type: 'required', message: 'Critical error', severity: 'error' },
        { field: 'optional', type: 'required', message: 'Optional warning', severity: 'warning' }
      ];

      const data = [{ critical: 'present', optional: '' }];
      const result = DataValidationService.validateData(data, undefined, rules);
      
      // Should still be valid (only warnings, no errors)
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
