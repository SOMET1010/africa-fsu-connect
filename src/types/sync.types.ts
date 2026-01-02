/**
 * Types partagés pour la synchronisation bidirectionnelle et la résolution de conflits
 * Phase 1 - Typage strict : élimination des 'any'
 */

import type { Json } from '@/integrations/supabase/types';

// ============ Connecteur API ============

export interface ApiConnectorAuthConfig {
  token?: string;
  api_key?: string;
  username?: string;
  password?: string;
}

export interface ApiConnector {
  id: string;
  agency_id: string;
  connector_type: string;
  endpoint_url?: string | null;
  auth_config?: ApiConnectorAuthConfig | null;
  auth_method?: string | null;
  sync_frequency?: number | null;
  is_active?: boolean | null;
  sync_status?: string | null;
  last_sync_at?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Données de synchronisation ============

export interface SyncRecordData {
  id?: string;
  external_id?: string;
  updated_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface SyncConflict {
  record_id: string;
  table_name: string;
  source_data: Record<string, unknown>;
  target_data: Record<string, unknown>;
  conflict_type: 'timestamp_conflict' | 'field_conflict' | 'delete_conflict';
}

// ============ Validation de données ============

export interface ValidationRuleValue {
  min?: number;
  max?: number;
  pattern?: string;
  format?: string;
}

export type CustomValidationFunction = (value: unknown) => boolean;

// ============ Utilitaires ============

/**
 * Type guard pour extraire un message d'erreur de manière type-safe
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur inattendue est survenue';
}

/**
 * Convertit un objet en Json compatible Supabase
 */
export function toJson<T>(value: T): Json {
  return value as unknown as Json;
}
