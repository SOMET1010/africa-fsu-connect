import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { type CustomValidationFunction, type ValidationRuleValue } from '@/types/sync.types';

export interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'length' | 'range' | 'custom' | 'unique';
  value?: ValidationRuleValue | string | CustomValidationFunction;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalRecords: number;
    validRecords: number;
    errorRecords: number;
    warningRecords: number;
  };
}

export interface ValidationError {
  field: string;
  value: unknown;
  message: string;
  severity: 'error' | 'warning' | 'info';
  recordIndex?: number;
}

export interface DataTransformation {
  field: string;
  transformationType: 'normalize' | 'format' | 'convert' | 'enrich' | 'clean';
  config: {
    from?: string;
    to?: string;
    format?: string;
    enrichmentSource?: string;
    cleaningRules?: string[];
  };
}

interface LengthConfig {
  min?: number;
  max?: number;
}

interface RangeConfig {
  min?: number;
  max?: number;
}

export class DataValidationService {
  private static ajv = new Ajv({ allErrors: true });
  
  static {
    addFormats(this.ajv);
  }

  static validateData<T extends Record<string, unknown>>(
    data: T[], 
    schema?: object, 
    rules: ValidationRule[] = []
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    let validRecords = 0;

    data.forEach((record, index) => {
      const recordErrors = this.validateRecord(record, schema, rules, index);
      
      const recordHasErrors = recordErrors.some(e => e.severity === 'error');
      const recordHasWarnings = recordErrors.some(e => e.severity === 'warning');
      
      if (!recordHasErrors) {
        validRecords++;
      }

      errors.push(...recordErrors.filter(e => e.severity === 'error'));
      warnings.push(...recordErrors.filter(e => e.severity === 'warning'));
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalRecords: data.length,
        validRecords,
        errorRecords: data.length - validRecords,
        warningRecords: warnings.length
      }
    };
  }

  private static validateRecord<T extends Record<string, unknown>>(
    record: T, 
    schema?: object, 
    rules: ValidationRule[] = [], 
    recordIndex?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validation par schéma JSON
    if (schema) {
      const validate = this.ajv.compile(schema);
      const valid = validate(record);
      
      if (!valid && validate.errors) {
        validate.errors.forEach(error => {
          errors.push({
            field: error.instancePath || error.schemaPath,
            value: error.data,
            message: error.message || 'Erreur de validation',
            severity: 'error',
            recordIndex
          });
        });
      }
    }

    // Validation par règles personnalisées
    rules.forEach(rule => {
      const fieldValue = this.getNestedValue(record, rule.field);
      const ruleError = this.validateRule(rule, fieldValue, recordIndex);
      
      if (ruleError) {
        errors.push(ruleError);
      }
    });

    return errors;
  }

  private static validateRule(
    rule: ValidationRule, 
    value: unknown, 
    recordIndex?: number
  ): ValidationError | null {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return {
            field: rule.field,
            value,
            message: rule.message,
            severity: rule.severity,
            recordIndex
          };
        }
        break;

      case 'format':
        if (value && !this.validateFormat(value, rule.value as string)) {
          return {
            field: rule.field,
            value,
            message: rule.message,
            severity: rule.severity,
            recordIndex
          };
        }
        break;

      case 'length':
        if (value && !this.validateLength(value, rule.value as LengthConfig)) {
          return {
            field: rule.field,
            value,
            message: rule.message,
            severity: rule.severity,
            recordIndex
          };
        }
        break;

      case 'range':
        if (value !== undefined && !this.validateRange(value, rule.value as RangeConfig)) {
          return {
            field: rule.field,
            value,
            message: rule.message,
            severity: rule.severity,
            recordIndex
          };
        }
        break;

      case 'custom':
        if (rule.value && typeof rule.value === 'function') {
          const customValidator = rule.value as CustomValidationFunction;
          const isValid = customValidator(value);
          if (!isValid) {
            return {
              field: rule.field,
              value,
              message: rule.message,
              severity: rule.severity,
              recordIndex
            };
          }
        }
        break;
    }

    return null;
  }

  private static validateFormat(value: unknown, format: string): boolean {
    const strValue = String(value);
    switch (format) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue);
      case 'url':
        try {
          new URL(strValue);
          return true;
        } catch {
          return false;
        }
      case 'phone':
        return /^[\+]?[1-9][\d]{0,15}$/.test(strValue.replace(/[\s\-\(\)]/g, ''));
      case 'date':
        return !isNaN(Date.parse(strValue));
      case 'number':
        return !isNaN(Number(value));
      default:
        return true;
    }
  }

  private static validateLength(value: unknown, config: LengthConfig): boolean {
    const length = String(value).length;
    if (config.min !== undefined && length < config.min) return false;
    if (config.max !== undefined && length > config.max) return false;
    return true;
  }

  private static validateRange(value: unknown, config: RangeConfig): boolean {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (config.min !== undefined && num < config.min) return false;
    if (config.max !== undefined && num > config.max) return false;
    return true;
  }

  private static getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  static transformData<T extends Record<string, unknown>>(
    data: T[], 
    transformations: DataTransformation[]
  ): T[] {
    return data.map(record => {
      const transformedRecord = { ...record } as T;

      transformations.forEach(transformation => {
        const value = this.getNestedValue(transformedRecord, transformation.field);
        const transformedValue = this.applyTransformation(value, transformation);
        this.setNestedValue(
          transformedRecord as Record<string, unknown>, 
          transformation.field, 
          transformedValue
        );
      });

      return transformedRecord;
    });
  }

  private static applyTransformation(
    value: unknown, 
    transformation: DataTransformation
  ): unknown {
    switch (transformation.transformationType) {
      case 'normalize':
        return this.normalizeValue(value, transformation.config);
      case 'format':
        return this.formatValue(value, transformation.config.format!);
      case 'convert':
        return this.convertValue(value, transformation.config.from!, transformation.config.to!);
      case 'clean':
        return this.cleanValue(value, transformation.config.cleaningRules || []);
      case 'enrich':
        return this.enrichValue(value, transformation.config.enrichmentSource!);
      default:
        return value;
    }
  }

  private static normalizeValue(value: unknown, config: Record<string, unknown>): unknown {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    return value;
  }

  private static formatValue(value: unknown, format: string): unknown {
    switch (format) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();
      case 'currency':
        return new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'EUR' 
        }).format(Number(value));
      default:
        return value;
    }
  }

  private static convertValue(value: unknown, from: string, to: string): unknown {
    if (from === 'string' && to === 'number') {
      return Number(value);
    }
    if (from === 'number' && to === 'string') {
      return String(value);
    }
    if (from === 'string' && to === 'date') {
      return new Date(value as string);
    }
    return value;
  }

  private static cleanValue(value: unknown, rules: string[]): unknown {
    let cleaned = String(value);
    
    rules.forEach(rule => {
      switch (rule) {
        case 'trim':
          cleaned = cleaned.trim();
          break;
        case 'removeSpaces':
          cleaned = cleaned.replace(/\s+/g, '');
          break;
        case 'removeSpecialChars':
          cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, '');
          break;
        case 'removeDuplicateSpaces':
          cleaned = cleaned.replace(/\s+/g, ' ');
          break;
      }
    });
    
    return cleaned;
  }

  private static enrichValue(value: unknown, source: string): unknown {
    // Placeholder pour l'enrichissement de données
    // Pourrait faire appel à des APIs externes ou des bases de données
    return value;
  }

  private static setNestedValue(
    obj: Record<string, unknown>, 
    path: string, 
    value: unknown
  ): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce<Record<string, unknown>>((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  }

  static generateValidationReport(result: ValidationResult): string {
    const { summary, errors, warnings } = result;
    
    let report = `=== Rapport de Validation ===\n\n`;
    report += `Total des enregistrements: ${summary.totalRecords}\n`;
    report += `Enregistrements valides: ${summary.validRecords}\n`;
    report += `Enregistrements avec erreurs: ${summary.errorRecords}\n`;
    report += `Enregistrements avec avertissements: ${summary.warningRecords}\n\n`;
    
    if (errors.length > 0) {
      report += `=== Erreurs (${errors.length}) ===\n`;
      errors.forEach((error, index) => {
        report += `${index + 1}. Champ: ${error.field}\n`;
        report += `   Valeur: ${String(error.value)}\n`;
        report += `   Message: ${error.message}\n`;
        if (error.recordIndex !== undefined) {
          report += `   Enregistrement: ${error.recordIndex + 1}\n`;
        }
        report += `\n`;
      });
    }
    
    if (warnings.length > 0) {
      report += `=== Avertissements (${warnings.length}) ===\n`;
      warnings.forEach((warning, index) => {
        report += `${index + 1}. Champ: ${warning.field}\n`;
        report += `   Valeur: ${String(warning.value)}\n`;
        report += `   Message: ${warning.message}\n`;
        if (warning.recordIndex !== undefined) {
          report += `   Enregistrement: ${warning.recordIndex + 1}\n`;
        }
        report += `\n`;
      });
    }
    
    return report;
  }
}
