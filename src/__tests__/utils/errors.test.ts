import { describe, it, expect } from 'vitest';
import { toErrorMessage, isErrorLike, normalizeError } from '@/utils/errors';

describe('toErrorMessage', () => {
  it('should extract message from Error instance', () => {
    const error = new Error('Test error message');
    expect(toErrorMessage(error)).toBe('Test error message');
  });

  it('should return string errors directly', () => {
    expect(toErrorMessage('Simple string error')).toBe('Simple string error');
  });

  it('should extract message from error-like objects', () => {
    const errorLike = { message: 'Object error message' };
    expect(toErrorMessage(errorLike)).toBe('Object error message');
  });

  it('should return default message for null', () => {
    expect(toErrorMessage(null)).toBe('Une erreur inattendue est survenue');
  });

  it('should return default message for undefined', () => {
    expect(toErrorMessage(undefined)).toBe('Une erreur inattendue est survenue');
  });

  it('should return default message for numbers', () => {
    expect(toErrorMessage(404)).toBe('Une erreur inattendue est survenue');
  });

  it('should return default message for empty objects', () => {
    expect(toErrorMessage({})).toBe('Une erreur inattendue est survenue');
  });
});

describe('isErrorLike', () => {
  it('should return true for objects with message property', () => {
    expect(isErrorLike({ message: 'test' })).toBe(true);
  });

  it('should return true for Error instances', () => {
    expect(isErrorLike(new Error('test'))).toBe(true);
  });

  it('should return false for null', () => {
    expect(isErrorLike(null)).toBe(false);
  });

  it('should return false for strings', () => {
    expect(isErrorLike('error string')).toBe(false);
  });

  it('should return false for objects without message', () => {
    expect(isErrorLike({ error: 'test' })).toBe(false);
  });

  it('should return false for objects with non-string message', () => {
    expect(isErrorLike({ message: 123 })).toBe(false);
  });
});

describe('normalizeError', () => {
  it('should return Error instances unchanged', () => {
    const original = new Error('Original');
    const normalized = normalizeError(original);
    expect(normalized).toBe(original);
  });

  it('should wrap strings in Error', () => {
    const normalized = normalizeError('String error');
    expect(normalized).toBeInstanceOf(Error);
    expect(normalized.message).toBe('String error');
  });

  it('should wrap error-like objects in Error', () => {
    const normalized = normalizeError({ message: 'Object error' });
    expect(normalized).toBeInstanceOf(Error);
    expect(normalized.message).toBe('Object error');
  });

  it('should create default Error for unknown types', () => {
    const normalized = normalizeError(42);
    expect(normalized).toBeInstanceOf(Error);
    expect(normalized.message).toBe('Une erreur inattendue est survenue');
  });
});
