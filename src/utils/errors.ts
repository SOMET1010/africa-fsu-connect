/**
 * Centralized error handling utilities
 * Provides type-safe error message extraction and error type guards
 */

/**
 * Type guard to check if an unknown value is error-like (has a message property)
 */
export function isErrorLike(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Extracts a user-friendly error message from any error type
 * Safely handles Error instances, strings, and unknown types
 */
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (isErrorLike(error)) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue';
}

/**
 * Creates a standardized error object from unknown error
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(toErrorMessage(error));
}
