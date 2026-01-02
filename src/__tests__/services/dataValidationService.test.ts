import { describe, it, expect } from 'vitest';
import { 
  DataValidationService, 
  type ValidationRule,
  type DataTransformation
} from '@/services/dataValidationService';

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

    it('should validate email format', () => {
      const rules: ValidationRule[] = [
        { 
          field: 'email', 
          type: 'format', 
          value: 'email',
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

    it('should validate length constraints', () => {
      const rules: ValidationRule[] = [
        { 
          field: 'password', 
          type: 'length', 
          value: { min: 8, max: 50 },
          message: 'Password must be 8-50 characters', 
          severity: 'error' 
        }
      ];

      const validData = [{ password: 'validpassword123' }];
      expect(DataValidationService.validateData(validData, undefined, rules).isValid).toBe(true);

      const tooShort = [{ password: 'short' }];
      expect(DataValidationService.validateData(tooShort, undefined, rules).isValid).toBe(false);
    });

    it('should validate custom rules', () => {
      const rules: ValidationRule[] = [
        { 
          field: 'status', 
          type: 'custom', 
          value: (val: unknown) => ['active', 'inactive', 'pending'].includes(val as string),
          message: 'Invalid status', 
          severity: 'error' 
        }
      ];

      const validData = [{ status: 'active' }];
      expect(DataValidationService.validateData(validData, undefined, rules).isValid).toBe(true);

      const invalidData = [{ status: 'unknown' }];
      expect(DataValidationService.validateData(invalidData, undefined, rules).isValid).toBe(false);
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

    it('should validate nested fields', () => {
      const rules: ValidationRule[] = [
        { field: 'user.email', type: 'required', message: 'User email required', severity: 'error' }
      ];

      const validData = [{ user: { email: 'test@example.com' } }];
      expect(DataValidationService.validateData(validData, undefined, rules).isValid).toBe(true);

      const invalidData = [{ user: { email: '' } }];
      expect(DataValidationService.validateData(invalidData, undefined, rules).isValid).toBe(false);
    });
  });

  describe('transformData', () => {
    it('should apply normalize transformation', () => {
      const transformations: DataTransformation[] = [
        { field: 'name', transformationType: 'normalize', config: {} }
      ];

      const data = [{ name: '  John Doe  ' }];
      const result = DataValidationService.transformData(data, transformations);
      
      expect(result[0].name).toBe('john doe');
    });

    it('should apply format transformation - uppercase', () => {
      const transformations: DataTransformation[] = [
        { field: 'code', transformationType: 'format', config: { format: 'uppercase' } }
      ];

      const data = [{ code: 'abc123' }];
      const result = DataValidationService.transformData(data, transformations);
      
      expect(result[0].code).toBe('ABC123');
    });

    it('should apply format transformation - capitalize', () => {
      const transformations: DataTransformation[] = [
        { field: 'name', transformationType: 'format', config: { format: 'capitalize' } }
      ];

      const data = [{ name: 'john' }];
      const result = DataValidationService.transformData(data, transformations);
      
      expect(result[0].name).toBe('John');
    });

    it('should apply clean transformation', () => {
      const transformations: DataTransformation[] = [
        { 
          field: 'phone', 
          transformationType: 'clean', 
          config: { cleaningRules: ['removeSpaces', 'removeSpecialChars'] } 
        }
      ];

      const data = [{ phone: '+1 (555) 123-4567' }];
      const result = DataValidationService.transformData(data, transformations);
      
      expect(result[0].phone).toBe('15551234567');
    });

    it('should apply convert transformation', () => {
      const transformations: DataTransformation[] = [
        { field: 'count', transformationType: 'convert', config: { from: 'string', to: 'number' } }
      ];

      const data = [{ count: '42' }];
      const result = DataValidationService.transformData(data, transformations);
      
      expect(result[0].count).toBe(42);
      expect(typeof result[0].count).toBe('number');
    });
  });

  describe('generateValidationReport', () => {
    it('should generate a readable report', () => {
      const validationResult = {
        isValid: false,
        errors: [
          { field: 'email', value: 'invalid', message: 'Invalid email', severity: 'error' as const, recordIndex: 0 }
        ],
        warnings: [
          { field: 'phone', value: '', message: 'Phone recommended', severity: 'warning' as const, recordIndex: 0 }
        ],
        summary: {
          totalRecords: 1,
          validRecords: 0,
          errorRecords: 1,
          warningRecords: 1
        }
      };

      const report = DataValidationService.generateValidationReport(validationResult);
      
      expect(report).toContain('Rapport de Validation');
      expect(report).toContain('Total des enregistrements: 1');
      expect(report).toContain('Erreurs (1)');
      expect(report).toContain('Avertissements (1)');
      expect(report).toContain('Invalid email');
    });

    it('should handle clean results', () => {
      const cleanResult = {
        isValid: true,
        errors: [],
        warnings: [],
        summary: {
          totalRecords: 5,
          validRecords: 5,
          errorRecords: 0,
          warningRecords: 0
        }
      };

      const report = DataValidationService.generateValidationReport(cleanResult);
      
      expect(report).toContain('Enregistrements valides: 5');
      expect(report).not.toContain('Erreurs (');
    });
  });

  describe('Format validation', () => {
    it('should validate URL format', () => {
      const rules: ValidationRule[] = [
        { field: 'website', type: 'format', value: 'url', message: 'Invalid URL', severity: 'error' }
      ];

      expect(DataValidationService.validateData([{ website: 'https://example.com' }], undefined, rules).isValid).toBe(true);
      expect(DataValidationService.validateData([{ website: 'not-a-url' }], undefined, rules).isValid).toBe(false);
    });

    it('should validate phone format', () => {
      const rules: ValidationRule[] = [
        { field: 'phone', type: 'format', value: 'phone', message: 'Invalid phone', severity: 'error' }
      ];

      expect(DataValidationService.validateData([{ phone: '+33612345678' }], undefined, rules).isValid).toBe(true);
      expect(DataValidationService.validateData([{ phone: 'abc' }], undefined, rules).isValid).toBe(false);
    });

    it('should validate date format', () => {
      const rules: ValidationRule[] = [
        { field: 'date', type: 'format', value: 'date', message: 'Invalid date', severity: 'error' }
      ];

      expect(DataValidationService.validateData([{ date: '2024-01-15' }], undefined, rules).isValid).toBe(true);
      expect(DataValidationService.validateData([{ date: 'not-a-date' }], undefined, rules).isValid).toBe(false);
    });

    it('should validate number format', () => {
      const rules: ValidationRule[] = [
        { field: 'amount', type: 'format', value: 'number', message: 'Must be number', severity: 'error' }
      ];

      expect(DataValidationService.validateData([{ amount: '123.45' }], undefined, rules).isValid).toBe(true);
      expect(DataValidationService.validateData([{ amount: 'abc' }], undefined, rules).isValid).toBe(false);
    });
  });
});
