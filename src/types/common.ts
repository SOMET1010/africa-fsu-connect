/**
 * Common TypeScript types to eliminate 'any' usage
 */

// Generic data structures
export interface GenericRecord {
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: unknown;
  success?: boolean;
}

// User-related types
export interface UserAction {
  type: string;
  payload?: GenericRecord;
}

export interface StepData {
  [key: string]: string | number | boolean | string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onNext: (data?: StepData) => void }>;
}

// Component props
export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, row: GenericRecord) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: GenericRecord[];
  loading?: boolean;
  onRowClick?: (row: GenericRecord) => void;
}

// Form and preference types
export interface PreferenceUpdate {
  [key: string]: string | number | boolean | GenericRecord;
}

export interface FormSelectOption {
  value: string;
  label: string;
}

// Agency and organization types
export interface AgencyMetadata {
  [key: string]: unknown;
}

export interface AgencyBase {
  id: string;
  name: string;
  acronym?: string;
  country?: string;
  region?: string;
  metadata?: AgencyMetadata;
}

// Document and resource types
export interface DocumentBase {
  id: string;
  title: string;
  file_url?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

// Security and audit types
export interface SecurityEventDetails {
  [key: string]: string | number | boolean | null;
}

export interface AuditLogDetails {
  [key: string]: unknown;
}

// Export format and type definitions
export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type ExportType = 'all' | 'filtered' | 'selected';

// Generic event handler types
export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;
export type ErrorHandler = (error: Error | unknown) => void;

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string | number;

// React component types
export interface ComponentWithData<T = GenericRecord> {
  data?: T;
  loading?: boolean;
  error?: string | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Chart and visualization types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TooltipFormatterParams {
  value: number;
  name: string;
  payload?: GenericRecord;
}

export type TooltipFormatter = (value: number, name: string, payload?: GenericRecord) => [string, string];