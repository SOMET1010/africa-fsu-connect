import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { BaseFieldProps } from './types';

interface ModernTextareaProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
}

export const ModernTextarea = forwardRef<HTMLTextAreaElement, ModernTextareaProps>(({
  label,
  description,
  error,
  success,
  required,
  disabled,
  placeholder,
  value,
  onChange,
  rows = 4,
  className,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        rows={rows}
        className={cn(
          "transition-all duration-300 bg-background/50 backdrop-blur-sm",
          "border-border/50 hover:border-border focus:border-primary",
          "focus:ring-2 focus:ring-primary/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
          focused && "shadow-lg shadow-primary/10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        {...props}
      />
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {success}
        </p>
      )}
    </div>
  );
});

ModernTextarea.displayName = "ModernTextarea";