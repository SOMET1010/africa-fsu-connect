import { z } from 'zod';

// ===== USER PREFERENCES VALIDATION =====
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2).max(5),
  notifications: z.boolean(),
  layout: z.enum(['compact', 'comfortable', 'spacious']),
  accessibility: z.object({
    highContrast: z.boolean(),
    fontSize: z.enum(['small', 'medium', 'large']),
    reduceMotion: z.boolean(),
  }),
  dashboard: z.object({
    layout: z.array(z.string()),
    autoRefresh: z.boolean(),
    refreshInterval: z.number().min(5000).max(300000), // 5s to 5min
  }),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// ===== SECURITY VALIDATION =====
export const securityPreferencesSchema = z.object({
  twoFactorEnabled: z.boolean(),
  sessionTimeout: z.number().min(300).max(86400), // 5min to 24h
  loginNotifications: z.boolean(),
  securityAlerts: z.boolean(),
  e2eEncryptionEnabled: z.boolean(),
  maxConcurrentSessions: z.number().min(1).max(10),
});

export type SecurityPreferences = z.infer<typeof securityPreferencesSchema>;

// ===== AUDIT LOG VALIDATION =====
export const auditLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  actionType: z.string(),
  resourceType: z.string().nullable(),
  resourceId: z.string().nullable(),
  details: z.record(z.unknown()).nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  success: z.boolean(),
  createdAt: z.string(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

// ===== API RESPONSE VALIDATION =====
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

// ===== VALIDATION UTILITIES =====
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(
        `Validation error: ${firstError.message}`,
        firstError.path.join('.'),
        firstError.received
      );
    }
    throw error;
  }
};

export const validatePartialData = <T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> => {
  try {
    return (schema as any).partial().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new ValidationError(
        `Validation error: ${firstError.message}`,
        firstError.path.join('.'),
        firstError.received
      );
    }
    throw error;
  }
};

// Safe parsing that returns success/error objects
export const safeValidateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      error: result.error.errors[0]?.message || 'Validation failed',
      field: result.error.errors[0]?.path.join('.'),
    };
  }
};