export interface BaseFieldProps {
  label: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}